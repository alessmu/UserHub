import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Import des routes
import routesProfils from "./routes/routesProfils.js";
import routesConnexion from "./routes/routesConnexion.js";

dotenv.config(); // Charger les variables d'environnement

const app = express();

// Middleware
app.use(cors()); // En-têtes CORS
app.use(express.json()); // Lire les données JSON dans req.body

// Routes
app.use("/profils", routesProfils);
app.use("/", routesConnexion);

// Connexion MongoDB
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch((err) => console.error("Connexion à MongoDB échouée :", err));

// Exporter l'app pour server.js
export default app;
