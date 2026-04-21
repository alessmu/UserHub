import express from "express";
import { connexion } from "../controleurs/authentification.js";

const routeur = express.Router();

// La route POST pour se connecter
routeur.post("/connexion", connexion);

export default routeur;
