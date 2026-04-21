import Utilisateur from "../modeles/Utilisateur.js";

// Middleware qui vérifie si l'utilisateur authentifié est un administrateur
export default function estAdmin(req, res, next) {
    // Chercher l'utilisateur dans la base de données à partir de son ID
    Utilisateur.findById(req.auth.userId)
        .then((utilisateur) => {
            // Si aucun utilisateur n'est trouvé (ID invalide), on retourne une erreur 404
            if (!utilisateur) {
                return res
                    .status(404)
                    .json({ message: "Utilisateur non trouvé" });
            }
            // Si l'utilisateur n'est pas un administrateur, on refuse l'accès (erreur 403)
            if (!utilisateur.est_admin) {
                return res
                    .status(403)
                    .json({ message: "Accès refusé: administrateur requis" });
            }

            next(); // utilisateur est admin, on continue
        })
        // Si une erreur survient lors de la recherche dans MongoDB
        .catch((error) => {
            res.status(500).json({
                message: "Erreur serveur",
                erreur: error.message,
            });
        });
}
