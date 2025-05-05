// controllers/authController.js
import User from "../models/User.js";
import crypto from "crypto";
import {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
} from "../validations/authValidation.js";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../services/emailService.js";

/**
 * @desc    Inscription d'un nouvel utilisateur
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    // Valider les données d'entrée
    const { error, value } = validateRegister(req.body);
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return res.status(400).json({ success: false, errors });
    }

    // Destructurer les données validées
    const { nom, prenom, telephone, adresse, email, login, password } = value;

    // Vérifier si l'email existe déjà
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        errors: { email: "Cet email est déjà utilisé" },
      });
    }

    // Vérifier si le login existe déjà
    const loginExists = await User.findOne({ login });
    if (loginExists) {
      return res.status(400).json({
        success: false,
        errors: { login: "Ce login est déjà utilisé" },
      });
    }

    // Créer le nouvel utilisateur
    const user = await User.create({
      nom,
      prenom,
      telephone,
      adresse,
      email,
      login,
      password,
    });

    // Envoyer l'email de bienvenue
    await sendWelcomeEmail(user);

    // Créer le token JWT
    const token = user.generateAuthToken();

    // Envoyer la réponse avec le token
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        login: user.login,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Connexion d'un utilisateur
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    // Valider les données d'entrée
    const { error, value } = validateLogin(req.body);
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return res.status(400).json({ success: false, errors });
    }

    // Destructurer les données validées
    const { login, password } = value;

    // Chercher l'utilisateur par login (identifiant ou email)
    const user = await User.findOne({
      $or: [{ login }, { email: login }],
    }).select("+password");

    // Vérifier si l'utilisateur existe et si le mot de passe est correct
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Identifiants incorrects",
      });
    }

    // Créer le token JWT
    const token = user.generateAuthToken();

    // Envoyer la réponse avec le token
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        login: user.login,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Récupérer les informations de l'utilisateur actuel
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    // L'utilisateur est déjà récupéré par le middleware d'authentification
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        nom: req.user.nom,
        prenom: req.user.prenom,
        telephone: req.user.telephone,
        adresse: req.user.adresse,
        email: req.user.email,
        login: req.user.login,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Demande de réinitialisation de mot de passe
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res, next) => {
  try {
    // Valider les données d'entrée
    const { error, value } = validateForgotPassword(req.body);
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return res.status(400).json({ success: false, errors });
    }

    // Destructurer les données validées
    const { email } = value;

    // Chercher l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Aucun utilisateur trouvé avec cet email",
      });
    }

    // Générer un token de réinitialisation
    const resetToken = user.generateResetPasswordToken();
    await user.save();

    // Envoyer l'email de réinitialisation
    try {
      await sendPasswordResetEmail(user, resetToken, req);

      res.status(200).json({
        success: true,
        message: "Email de réinitialisation envoyé",
      });
    } catch (error) {
      // Si l'envoi d'email échoue, réinitialiser les champs de token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({
        success: false,
        message: "Erreur lors de l'envoi de l'email",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Réinitialisation de mot de passe
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
export const resetPassword = async (req, res, next) => {
  try {
    // Valider les données d'entrée
    const { error, value } = validateResetPassword(req.body);
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return res.status(400).json({ success: false, errors });
    }

    // Hacher le token de réinitialisation
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    // Chercher l'utilisateur par token de réinitialisation et vérifier si le token n'est pas expiré
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token invalide ou expiré",
      });
    }

    // Définir le nouveau mot de passe
    user.password = value.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Envoyer la réponse
    res.status(200).json({
      success: true,
      message: "Mot de passe réinitialisé avec succès",
    });
  } catch (error) {
    next(error);
  }
};