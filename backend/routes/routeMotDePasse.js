import express from "express";
import { generer_mdp } from "../controleurs/motDePasse.js";

const routeur = express.Router();

routeur.get("/:longueur", generer_mdp); // exemple : /motdepasse/12

export default routeur;



