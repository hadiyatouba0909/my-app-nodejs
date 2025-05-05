import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    prenom: {
      type: String,
      required: [true, "Le prénom est requis"],
      trim: true,
    },
    telephone: {
      type: String,
      required: [true, "Le numéro de téléphone est requis"],
      trim: true,
    },
    adresse: {
      type: String,
      required: [true, "L'adresse est requise"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Veuillez fournir un email valide",
      ],
    },
    login: {
      type: String,
      required: [true, "Le login est requis"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Le mot de passe est requis"],
      minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
      select: false, // Ne pas inclure par défaut dans les requêtes
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: {
      type: Date
    }
  },
  { timestamps: true }
);

// Middleware pour hacher le mot de passe avant de le sauvegarder
userSchema.pre("save", async function (next) {
  // Ne pas hacher à nouveau si le mot de passe n'a pas été modifié
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour vérifier si le mot de passe est correct
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour générer un token JWT
userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Méthode pour générer un token de réinitialisation de mot de passe
userSchema.methods.generateResetPasswordToken = function () {
  // Générer un token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hacher le token et le stocker dans resetPasswordToken
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Définir la date d'expiration (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

export default User;