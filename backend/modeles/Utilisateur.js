import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

// Définir le schéma d'utilisateur
const utilisateurSchema = mongoose.Schema({
    pseudo: { type: String, required: true },
    courriel: { type: String, required: true, unique: true },
    mot_de_passe: { type: String, required: true },
    est_admin: { type: Boolean, required: true },
});

// Pour s'assurer que le champ courriel est unique
utilisateurSchema.plugin(uniqueValidator);

// Exporter le modèle
export default mongoose.model("Utilisateur", utilisateurSchema);
