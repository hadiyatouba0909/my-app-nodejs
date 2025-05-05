// config/emailConfig.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === "465", // true pour le port 465, false pour d'autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Utilisez la variable que vous avez définie
  },
  // Pour le port 587, ajoutez ces options
  tls: {
    rejectUnauthorized: false, // Peut être nécessaire en développement
  }
});

// Vérifiez la connexion
transporter.verify((error, success) => {
  if (error) {
    console.error("Erreur de configuration email:", error);
  } else {
    console.log("Serveur email prêt à envoyer des messages");
  }
});