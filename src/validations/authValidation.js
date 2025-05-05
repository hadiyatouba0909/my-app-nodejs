// validations/authValidation.js
import Joi from "joi";

// Validation pour l'inscription
export const validateRegister = (data) => {
  const schema = Joi.object({
    nom: Joi.string().required().messages({
      "string.empty": "Le nom est requis",
      "any.required": "Le nom est requis",
    }),
    prenom: Joi.string().required().messages({
      "string.empty": "Le prénom est requis",
      "any.required": "Le prénom est requis",
    }),
    telephone: Joi.string().required().messages({
      "string.empty": "Le numéro de téléphone est requis",
      "any.required": "Le numéro de téléphone est requis",
    }),
    adresse: Joi.string().required().messages({
      "string.empty": "L'adresse est requise",
      "any.required": "L'adresse est requise",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Veuillez fournir un email valide",
      "string.empty": "L'email est requis",
      "any.required": "L'email est requis",
    }),
    login: Joi.string().required().messages({
      "string.empty": "Le login est requis",
      "any.required": "Le login est requis",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Le mot de passe doit contenir au moins {#limit} caractères",
      "string.empty": "Le mot de passe est requis",
      "any.required": "Le mot de passe est requis",
    }),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "Les mots de passe ne correspondent pas",
      "string.empty": "La confirmation du mot de passe est requise",
      "any.required": "La confirmation du mot de passe est requise",
    }),
    termsAccepted: Joi.boolean().valid(true).required().messages({
      "any.only": "Vous devez accepter les conditions d'utilisation",
      "any.required": "Vous devez accepter les conditions d'utilisation",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

// Validation pour la connexion
export const validateLogin = (data) => {
  const schema = Joi.object({
    login: Joi.string().required().messages({
      "string.empty": "Le login est requis",
      "any.required": "Le login est requis",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Le mot de passe est requis",
      "any.required": "Le mot de passe est requis",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

// Validation pour la demande de réinitialisation de mot de passe
export const validateForgotPassword = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Veuillez fournir un email valide",
      "string.empty": "L'email est requis",
      "any.required": "L'email est requis",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

// Validation pour la réinitialisation de mot de passe
export const validateResetPassword = (data) => {
  const schema = Joi.object({
    password: Joi.string().min(6).required().messages({
      "string.min": "Le mot de passe doit contenir au moins {#limit} caractères",
      "string.empty": "Le mot de passe est requis",
      "any.required": "Le mot de passe est requis",
    }),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
      "any.only": "Les mots de passe ne correspondent pas",
      "string.empty": "La confirmation du mot de passe est requise",
      "any.required": "La confirmation du mot de passe est requise",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};