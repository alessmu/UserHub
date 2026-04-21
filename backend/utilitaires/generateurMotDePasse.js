// Fonction qui génère un mot de passe aléatoire d'une certaine longueur
export default function genererMotDePasse(longueur) {
    // Chaîne contenant tous les caractères permis
    const caracteres_permis =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    // Variable qui contiendra le mot de passe généré
    let mot_de_passe = "";

    // Boucle qui ajoute un caractère aléatoire à chaque itération
    for (let i = 0; i < longueur; i++) {
        // Génère un index aléatoire entre 0 et la longueur de caracteres_permis
        const index_aleatoire = Math.floor(
            Math.random() * caracteres_permis.length
        );
        // Ajoute le caractère correspondant à cet index au mot de passe
        mot_de_passe += caracteres_permis[index_aleatoire];
    }
    return mot_de_passe;
}
