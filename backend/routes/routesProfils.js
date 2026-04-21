import express from "express";
import {
    creerProfil,
    lireTous,
    supprimer,
    lireUn,
    modifier,
} from "../controleurs/profilControleur.js";
import auth from "../middleware/auth.js"; // Vérifie le token JWT
import estAdmin from "../middleware/estAdmin.js"; // Vérifie si est admin
// Vérifie que l'utilisateur accède à son propre profil
import verifierAcces from "../middleware/verifierAcces.js";

const routeur = express.Router();

//--- Routes ---

// Route d'inscription
routeur.post("/", creerProfil);

// Route de lecture de tous les utilisateurs
routeur.get("/", auth, estAdmin, lireTous);
// Route pour supprimer un utlisateur
routeur.delete("/:id", auth, estAdmin, supprimer);
// Route pour lire un seul utilisateur
routeur.get("/:id", auth, verifierAcces, lireUn);
// Modification d'un profil
routeur.put("/:id", auth, verifierAcces, modifier);

export default routeur;
