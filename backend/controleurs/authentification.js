import Utilisateur from "../modeles/Utilisateur.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Fonction appelée lors d'une tentative de connexion
export function connexion(req, res) {
    // On cherche l'utilisateur dans la BD avec l'adresse courriel reçue
    Utilisateur.findOne({ courriel: req.body.courriel })
        .then((utilisateur) => {
            // Si aucun utilisateur n'est trouvé → on retourne une erreur 401 (non autorisé)
            if (!utilisateur) {
                return res
                    .status(401)
                    .json({ message: "Courriel ou mot de passe incorrect." });
            }

            // Si l'utilisateur est trouvé, on compare les mots de passe (en clair vs haché)
            bcrypt
                .compare(req.body.mot_de_passe, utilisateur.mot_de_passe)
                .then((valide) => {
                    // Si les mots de passe ne correspondent pas, erreur 401
                    if (!valide) {
                        return res.status(401).json({
                            message: "Courriel ou mot de passe incorrect.",
                        });
                    }

                    // Si la connexion est valide, on génère un token JWT
                    const token = jwt.sign(
                        { userId: utilisateur._id },
                        process.env.JWT_SECRET || "PHRASE_ALEATOIRE_TRES_LONGUE",
                        { expiresIn: "24h" }
                    );

                    // On retourne une réponse avec l'id de l'utilisateur et le token
                    res.status(200).json({
                        userId: utilisateur._id,
                        token: token,
                    });
                })
                .catch((erreur) => {
                    // Si une erreur survient pendant la comparaison de mots de passe
                    res.status(500).json({ erreur });
                });
        })
        .catch((erreur) => {
            // Si une erreur survient pendant le findOne dans MongoDB
            res.status(500).json({ erreur });
        });
}
