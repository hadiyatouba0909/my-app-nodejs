// middleware/auth.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Middleware pour protéger les routes et vérifier l'authentification
 */
const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est présent dans les headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extraire le token du header Authorization (format: "Bearer TOKEN")
      token = req.headers.authorization.split(" ")[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur du token (sans le mot de passe)
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({
        success: false,
        message: "Non autorisé, token invalide ou expiré",
      });
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Non autorisé, aucun token fourni",
    });
  }
};

export { protect };