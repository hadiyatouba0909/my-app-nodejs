// routes/authRoutes.js
import express from "express";
import {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";
import {
  updateProfile,
  updatePassword
} from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Routes publiques
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);

// Routes protégées (nécessitent une authentification)
router.get("/me", protect, getMe);
router.put("/update-profile", protect, updateProfile);
router.put("/update-password", protect, updatePassword);

export default router;