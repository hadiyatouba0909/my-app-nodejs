// services/emailService.js
import { transporter } from "../config/emailConfig.js";

export const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: `"GANDAL-TECH-INC" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Bienvenue sur notre plateforme !",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://via.placeholder.com/150" alt="Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #4f46e5; text-align: center;">Bienvenue ${user.prenom} ${user.nom} !</h2>
        <p>Merci de vous être inscrit sur notre plateforme. Nous sommes ravis de vous compter parmi nos utilisateurs.</p>
        <p>Voici vos informations de connexion :</p>
        <ul>
          <li><strong>Login :</strong> ${user.login}</li>
          <li><strong>Email :</strong> ${user.email}</li>
        </ul>
        <p>N'hésitez pas à nous contacter si vous avez des questions.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
          <p>&copy; ${new Date().getFullYear()} Votre Application. Tous droits réservés.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (user, resetToken, req) => {
  // Construire l'URL de réinitialisation (frontend)
  const resetUrl = `${req.protocol}://localhost:3000/reset-password/${resetToken}`;

  const mailOptions = {
    from: `"GANDAL-TECH-INC" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "Réinitialisation de votre mot de passe",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="https://via.placeholder.com/150" alt="Logo" style="max-width: 150px;">
        </div>
        <h2 style="color: #4f46e5; text-align: center;">Réinitialisation de mot de passe</h2>
        <p>Vous avez demandé une réinitialisation de votre mot de passe. Veuillez cliquer sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Réinitialiser mon mot de passe</a>
        </div>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        <p><strong>Note :</strong> Ce lien est valable pendant 10 minutes.</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666;">
          <p>&copy; ${new Date().getFullYear()} Votre Application. Tous droits réservés.</p>
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email envoyé: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
};