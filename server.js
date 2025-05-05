import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./src/config/dbMongo.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import errorHandler from "./src/middleware/errorHandler.js";

// Connexion à la base de données
connectDB();

const app = express();

// Middleware pour parser le JSON
app.use(express.json());

// Configuration CORS (une seule fois)
app.use(cors({
  origin: 'http://localhost:3000', // L'URL de votre frontend
  credentials: true
}));

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api", productRoutes); // Mount product routes under /api

// Route racine simple
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API Node.js");
});

// Middleware de gestion d'erreurs
app.use(errorHandler);

// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ error: "Route non trouvée" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));