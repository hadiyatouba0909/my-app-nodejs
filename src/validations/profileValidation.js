// validations/profileValidation.js
import Joi from "joi";

// Validation pour la mise à jour du profil
export const validateUpdateProfile = (data) => {
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
  });

  return schema.validate(data, { abortEarly: false });
};

// Validation pour la mise à jour du mot de passe
export const validateUpdatePassword = (data) => {
  const schema = Joi.object({
    currentPassword: Joi.string().required().messages({
      "string.empty": "Le mot de passe actuel est requis",
      "any.required": "Le mot de passe actuel est requis",
    }),
    newPassword: Joi.string().min(6).required().messages({
      "string.min": "Le nouveau mot de passe doit contenir au moins {#limit} caractères",
      "string.empty": "Le nouveau mot de passe est requis",
      "any.required": "Le nouveau mot de passe est requis",
    }),
    confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
      "any.only": "Les mots de passe ne correspondent pas",
      "string.empty": "La confirmation du mot de passe est requise",
      "any.required": "La confirmation du mot de passe est requise",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};