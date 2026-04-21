// Contexte d'authentification global pour l'application.
// Fournit l’état de l’utilisateur connecté, son token, et les fonctions login/logout.
// Permet de centraliser la gestion de la session dans toute l’application React.

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

// Création du contexte d'authentification
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    // État de l’utilisateur connecté
    const [user, setUser] = useState(null);
    // Token JWT stocké
    const [token, setToken] = useState(null);
    // Indique si on est encore en train de vérifier la session existante 
    const [loading, setLoading] = useState(true);

    // Au premier chargement : récupérer session stockée
    useEffect(() => {
        const t = localStorage.getItem("token");
        const u = localStorage.getItem("user");
        // Si on a un token et un utilisateur, on les parse et on les stocke
        // Sinon, on laisse l'état initial (null)
        if (t && u) {
            try {
                const parsed = JSON.parse(u);
                const normalized = {
                    ...parsed,
                    est_admin: parsed.est_admin ?? parsed.est_admin,
                };
                setUser(normalized);
                setToken(t);
            } catch (_) {}
        }
        setLoading(false);
    }, []);

    // setAuthData → centralise la mise à jour du token + user
    // Permet d’enregistrer dans le localStorage et de normaliser
    function setAuthData(profil, tok) {
        const normalized = {
            ...profil,
            est_admin: profil.est_admin ?? profil.est_admin,
        };
        setUser(normalized);
        setToken(tok);
        if (tok) localStorage.setItem("token", tok);
        if (profil) localStorage.setItem("user", JSON.stringify(normalized));
    }

    // Login complet : POST /connexion puis GET /profils/:id
    async function login(courriel, mot_de_passe) {
        const auth = await api.login(courriel, mot_de_passe); // { userId, token }
        const profil = await api.getUser(auth.userId, auth.token);
        setAuthData(profil, auth.token);
        return profil;
    }

    // Logout : supprime le token et l'utilisateur du localStorage
    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setToken(null);
    }

    // Fournit l'état de l'utilisateur, le token et les fonctions de connexion/déconnexion
    return (
        <AuthContext.Provider
            value={{ user, token, login, logout, setAuthData, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
