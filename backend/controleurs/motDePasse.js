import genererMotDePasse from "../utilitaires/generateurMotDePasse.js";

// Fonction pour générer un mot de passe aléatoire, avec une longueur choisie
// par l'utilisateur
export function generer_mdp(req, res) {
    // Extraire la longueur rentrée par l'utilisateur depuis les paramètres de l'URL (/motdepasse/:longueur)
    const longueur = parseInt(req.params.longueur);

    // Vérifier que la longueur est un nombre valide et raisonnable
    if (isNaN(longueur) || longueur < 5 || longueur > 128) {
        return res.status(400).json({
            message:
                "Longueur invalide. Le mot de passe doit avoir entre 5 et 128 caractères",
        });
    }

    // Générer un mot de passe aléatoire avec la longueur spécifiée
    const mot_de_passe_aleatoire = genererMotDePasse(longueur);

    // Retourner le mot de passe généré dans la réponse JSON
    res.status(200).json({
        mot_de_passe: mot_de_passe_aleatoire,
        longueur: longueur,
    });
}
