export default function verifierAcces(req, res, next) {
    // Vérifie que l'utilisateur connecté (dans le token) accède à son propre ID
    if (req.auth.userId === req.params.id) {
        return next(); // autorisé
    }

    // Sinon, accès refusé
    return res
        .status(403)
        .json({ message: "Accès interdit: ce n'est pas votre profil." });
}
