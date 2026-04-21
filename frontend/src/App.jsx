// Fichier principal de l’application React.
// Définit les routes avec React Router, gère la navigation sécurisée (authentification, admin),
// et englobe l’application dans le AuthProvider pour partager l’état utilisateur.

// Importation des dépendances et des composants nécessaires.
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Accueil from "./pages/Accueil";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import Profil from "./pages/Profil";
import ListeProfils from "./pages/ListeProfils";
import SupprimerUtilisateur from "./pages/SupprimerUtilisateur.jsx";
import Documentation from "./pages/Documentation";

// Middleware de route privée (utilisateur connecté requis)
function PrivateRoute({ children }) {
    const { user, loading } = useAuth();
    // Si on est encore en train de charger le contexte
    if (loading) return <div className='p-6'>Chargement…</div>;

    // Si l'utilisateur n’est pas connecté → redirection vers /connexion
    if (!user) return <Navigate to='/connexion' replace />;
    return children;
}

// Middleware de route admin (utilisateur + admin requis)
function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className='p-6'>Chargement…</div>;
    if (!user) return <Navigate to='/connexion' replace />;
    if (!user.est_admin)
        return <div className='p-6 text-red-600'>Accès refusé</div>;
    return children;
}

// Composant principal de l’application
export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Layout />
            </BrowserRouter>
        </AuthProvider>
    );
}

// Layout principal : inclut la navbar et définit les routes
function Layout() {
    const { user, logout } = useAuth();
    return (
        <div className='min-h-screen bg-gray-50'>
            {/* Barre de navigation persistante */}
            <Navbar
                user={user}
                onLogout={() => {
                    logout();
                }}
            />
            <main>
                <Routes>
                    {/* Routes publiques */}
                    <Route path='/' element={<Accueil />} />
                    <Route path='/inscription' element={<Inscription />} />
                    <Route path='/connexion' element={<Connexion />} />
                    {/* <Route
                        path='/profil'
                        element={
                            <PrivateRoute>
                                <Profil />
                            </PrivateRoute>
                        }
                    /> */}
                    <Route
                        path='/profils'
                        element={
                            <PrivateRoute>
                                <ListeProfils />
                            </PrivateRoute>
                        }
                    />

                    {/* Routes privées accessibles uniquement si connecté */}
                    <Route
                        path='/profils/:id'
                        element={
                            <PrivateRoute>
                                <Profil />
                            </PrivateRoute>
                        }
                    />

                    {/* Page de suppression de compte */}
                    <Route
                        path='/supprimer'
                        element={
                            <PrivateRoute>
                                <SupprimerUtilisateur />
                            </PrivateRoute>
                        }
                    />

                    {/* Documentation de l’API, accessible aux connectés */}
                    <Route
                        path='/documentation'
                        element={
                            <PrivateRoute>
                                <Documentation />
                            </PrivateRoute>
                        }
                    />

                    {/* Erreur 404 */}
                    <Route path='*' element={<div className='p-6'>404</div>} />
                </Routes>
            </main>
        </div>
    );
}
