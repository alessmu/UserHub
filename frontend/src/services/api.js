// Fichier utilitaire qui regroupe toutes les requêtes HTTP vers le backend.
// Fournit une API propre pour les appels comme login, signup, getUser, updateUser, etc.

// Utilise l'API Fetch pour faire des requêtes HTTP
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const LOGIN_PATH = "/connexion"; // route POST connexion

// Fonction générique de requête HTTP
async function request(path, { method = "GET", body, token } = {}) {
    const headers = { "Content-Type": "application/json" };

    // Ajoute le token JWT dans l’en-tête si présent
    if (token) headers.Authorization = `Bearer ${token}`;

    // Lance la requête fetch vers `${API_URL}${path}`
    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
    });

    let data = null;
    try {
        // Essaie de parser la réponse en JSON
        data = await res.json();
    } catch {}

    // Si la réponse n'est pas au format JSON, erreur
    if (!res.ok) {
        const msg = data?.message || data?.erreur || `Erreur ${res.status}`;
        throw new Error(msg);
    }
    return data;
}

// Fonctions exportées pour utiliser l’API
export const api = {

    // Inscription d’un nouvel utilisateur 
    signup: ({ pseudo, courriel, mot_de_passe, est_admin }) =>
        request("/profils", {
            method: "POST",
            body: { pseudo, courriel, mot_de_passe, est_admin },
        }),

    // Connexion utilisateur
    login: (courriel, mot_de_passe) =>
        request(LOGIN_PATH, {
            method: "POST",
            body: { courriel, mot_de_passe },
        }),

    // Route GET / profils/:id
    getUser: (id, token) => request(`/profils/${id}`, { token }),

// Génération de mot de passe aléatoire
    generatePassword: (len) => request(`/motdepasse/${len}`),

    // Route GET / profils
    getAllUsers: (token) => request(`/profils`, { token }),

    /**
     * Met à jour un profil (pseudo, courriel, mot_de_passe…)
     * @param {string} id  – _id MongoDB
     * @param {Object} body – champs à modifier
     * @param {string} token – JWT
     */
    updateUser: (id, body, token) =>
        request(`/profils/${id}`, {
            method: "PUT",
            body,
            token,
        }),

    deleteUser: (id, token) =>
        request(`/profils/${id}`, { method: "DELETE", token }),

};
