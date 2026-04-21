// Connexion.jsx

import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Connexion() {
    const { user, login } = useAuth();
    const navigate = useNavigate();

    // Si déjà connecté on redirige 
    if (user) return <Navigate to='/' replace />;

    const [courriel, setCourriel] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [showPwd, setShowPwd] = useState(false); //  même logique que inscription
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    // Fonction pour gérer la soumission du formulaire
    async function handleSubmit(e) {
        e.preventDefault();
        setErr(null);
        // Validation basique
        if (!courriel.trim() || !motDePasse)
            return setErr("Tous les champs sont requis.");
        setLoading(true);
        try {
            // Si ton AuthContext expose déjà login()
            await login(courriel, motDePasse);
            navigate("/");
        } catch (e2) {
            setErr(e2.message);
        } finally {
            setLoading(false);
        }
    }

    
    return (
        <div className='flex items-center justify-center px-4 py-10 min-h-[calc(100vh-56px)]'>
            <div className='w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
                <h1 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
                    Connexion
                </h1>

                {/* Affichage des erreurs */}
                {err && (
                    <div className='mb-4 rounded bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700'>
                        {err}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* Courriel */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Courriel
                        </label>
                        <input
                            type='email'
                            value={courriel}
                            onChange={(e) => setCourriel(e.target.value)}
                            placeholder='exemple@mail.com'
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500'
                            autoComplete='email'
                            required
                        />
                    </div>

                    {/* Mot de passe  */}
                    <div>
                        <div className='flex items-center justify-between'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Mot de passe
                            </label>
                            {motDePasse && (
                                <button
                                    type='button'
                                    onClick={() => setShowPwd((s) => !s)}
                                    className='text-xs text-indigo-600 hover:underline'>
                                    {showPwd ? "Masquer" : "Afficher"}
                                </button>
                            )}
                        </div>
                        <input
                            type={showPwd ? "text" : "password"}
                            value={motDePasse}
                            onChange={(e) => setMotDePasse(e.target.value)}
                            placeholder='Tape ton mot de passe'
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500'
                            autoComplete='current-password'
                            required
                        />
                        <p className='mt-1 text-xs text-gray-500'>
                            Clique sur “{showPwd ? "Masquer" : "Afficher"}” pour{" "}
                            {showPwd ? "cacher" : "voir"} le mot de passe.
                        </p>
                    </div>

                    <div>
                        {/* Bouton de soumission */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-60'>
                            {loading ? "Connexion…" : "Se connecter"}
                        </button>
                    </div>
                </form>

                <p className='mt-6 text-xs text-gray-500 text-center'>
                    Vérifie l’adresse et le mot de passe saisis.
                </p>
            </div>
        </div>
    );
}
