// controllers/profileController.js
import User from "../models/User.js";
import { 
  validateUpdateProfile, 
  validateUpdatePassword 
} from "../validations/profileValidation.js";

/**
 * @desc    Mettre à jour le profil de l'utilisateur
 * @route   PUT /api/auth/update-profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    // Valider les données d'entrée
    const { error, value } = validateUpdateProfile(req.body);
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return res.status(400).json({ success: false, errors });
    }

    // Destructurer les données validées
    const { nom, prenom, telephone, adresse } = value;

    // Chercher l'utilisateur
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Mettre à jour les champs
    user.nom = nom || user.nom;
    user.prenom = prenom || user.prenom;
    user.telephone = telephone || user.telephone;
    user.adresse = adresse || user.adresse;

    // Sauvegarder les modifications
    await user.save();

    // Envoyer la réponse
    res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès",
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom,
        telephone: user.telephone,
        adresse: user.adresse,
        email: user.email,
        login: user.login,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Mettre à jour le mot de passe
 * @route   PUT /api/auth/update-password
 * @access  Private
 */
export const updatePassword = async (req, res, next) => {
  try {
    // Valider les données d'entrée
    const { error, value } = validateUpdatePassword(req.body);
    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        errors[detail.path[0]] = detail.message;
      });
      return res.status(400).json({ success: false, errors });
    }

    // Destructurer les données validées
    const { currentPassword, newPassword } = value;

    // Chercher l'utilisateur avec le mot de passe
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur non trouvé",
      });
    }

    // Vérifier si l'ancien mot de passe est correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Mot de passe actuel incorrect",
      });
    }

    // Définir le nouveau mot de passe
    user.password = newPassword;
    await user.save();

    // Envoyer la réponse
    res.status(200).json({
      success: true,
      message: "Mot de passe mis à jour avec succès",
    });
  } catch (error) {
    next(error);
  }
};