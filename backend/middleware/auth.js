import jwt from "jsonwebtoken";

// Middleware d'authentification
export default function auth(req, res, next) {
    try {
        // On récupère l'en-tête 'Authorization' envoyé dans la requête
        const authorizationHeader = req.headers.authorization;

        // On récupère l'en-tête 'Authorization' envoyé dans la requête
        if (!authorizationHeader) {
            return res.status(401).json({ message: "Token manquant" });
        }

        // On récupère juste la deuxième partie ("Bearer <token>")
        const token = authorizationHeader.split(" ")[1];

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "PHRASE_ALEATOIRE_TRES_LONGUE");

        // On extrait l'identifiant de l'utilisateur qui a été encodé dans le token
        const userId = decodedToken.userId;

        // On ajoute l'information de l'utilisateur authentifié à l'objet req (accessible dans les routes)
        req.auth = { userId };

        next(); // passe à la suite
    } catch (error) {
        // Si une erreur survient (token invalide, expiré, etc.), on renvoie une erreur 401
        res.status(401).json([{ name: error.name, message: error.message }]);
    }
}
