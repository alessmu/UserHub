// Inscription.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";


export default function Inscription() {
    const navigate = useNavigate();
    // Accès à la fonction de connexion du contexte d'authentification
    const { login } = useAuth();

    // États pour les champs du formulaire
    const [pseudo, setPseudo] = useState("");
    const [courriel, setCourriel] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [estAdmin, setEstAdmin] = useState(false);

    // États pour la génération de mot de passe
    const [genLen, setGenLen] = useState(12);
    const [showPwd, setShowPwd] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false); // a déjà cliqué sur générer
    const [genSuccessMsg, setGenSuccessMsg] = useState("");

    // États pour la gestion des erreurs et du chargement
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    // Fonction pour générer le mot de passe
    async function handleGenerate(e) {
        e.preventDefault();
        setErr(null);
        setGenSuccessMsg("");
        try {
            const data = await api.generatePassword(genLen);
            const pwd =
                data.mot_de_passe ||
                data.motDePasse ||
                data.password ||
                Object.values(data)[0];
            if (typeof pwd !== "string") throw new Error("Réponse inattendue.");
            // Vérification de longueur
            if (pwd.length !== genLen) {
                setMotDePasse(pwd);
                setHasGenerated(true);
                setGenSuccessMsg(
                    `Mot de passe généré (${pwd.length} caractères – attendu ${genLen}).`
                );
            } else {
                // Mot de passe généré avec la bonne longueur
                setMotDePasse(pwd);
                setHasGenerated(true);
                setGenSuccessMsg(
                    `Mot de passe généré (${pwd.length} caractères).`
                );
            }
        } catch (e2) {
            setErr(e2.message || "Erreur génération");
        }
    }

    // Fonction pour copier le mot de passe dans la boite de textes
    function copyPwd() {
        if (!motDePasse) return;
        navigator.clipboard.writeText(motDePasse).then(() => {
            setGenSuccessMsg("Mot de passe copié dans le presse‑papiers.");
            setTimeout(() => {
                setGenSuccessMsg(
                    `Mot de passe généré (${motDePasse.length} caractères).`
                );
            }, 1500);
        });
    }

    // Fonction pour gérer la soumission du formulaire
    async function handleSubmit(e) {
        e.preventDefault();
        setErr(null);
        setGenSuccessMsg("");

        // Validation des champs
        if (!pseudo.trim() || !courriel.trim())
            return setErr("Pseudo et courriel requis.");
        if (!motDePasse) return setErr("Mot de passe requis (ou génère-le).");

        setLoading(true);
        try {
            await api.signup({
                pseudo,
                courriel,
                mot_de_passe: motDePasse,
                est_admin: estAdmin,
            });

            // Connexion automatique après inscription
            await login(courriel, motDePasse);
            navigate("/");
        } catch (e3) {
            setErr(e3.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center justify-center px-4 py-10 min-h-[calc(100vh-56px)]'>
            <div className='w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6'>
                <h1 className='text-2xl font-semibold text-gray-800 mb-6 text-center'>
                    Inscription
                </h1>

                {err && (
                    <div className='mb-4 rounded bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700'>
                        {err}
                    </div>
                )}

                {/* Message de succès après génération de mot de passe */}
                {genSuccessMsg && (
                    <div className='mb-4 flex items-start justify-between gap-2 rounded bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700'>
                        <span>{genSuccessMsg}</span>
                        {motDePasse && (
                            <button
                                type='button'
                                onClick={copyPwd}
                                className='shrink-0 text-xs font-medium text-green-700 underline hover:text-green-800'>
                                Copier
                            </button>
                        )}
                    </div>
                )}

                {/* Formulaire d’inscription */}
                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* Pseudo */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Pseudo
                        </label>
                        <input
                            value={pseudo}
                            onChange={(e) => setPseudo(e.target.value)}
                            placeholder='Ex: MonPseudo'
                            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500'
                            required
                        />
                    </div>

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
                            required
                        />
                    </div>

                    {/* Mot de passe + Génération */}
                    <div>
                        <div className='flex items-center justify-between'>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Mot de passe{" "}
                                {hasGenerated && (
                                    <span className='text-xs text-green-600'>
                                        (généré)
                                    </span>
                                )}
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

                        {/* Champ de mot de passe avec génération */}
                        <div className='flex gap-2'>
                            <input
                                type={showPwd ? "text" : "password"}
                                value={motDePasse}
                                onChange={(e) => {
                                    setMotDePasse(e.target.value);
                                    setHasGenerated(false);
                                    setGenSuccessMsg("");
                                }}
                                placeholder='Tape ou clique Générer'
                                className='flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500'
                            />
                            {/* Bouton Générer */}
                            <button
                                type='button'
                                onClick={handleGenerate}
                                className='px-3 rounded-md border border-indigo-500 text-indigo-600 hover:bg-indigo-50 text-sm'>
                                Générer
                            </button>
                        </div>

                        {/* Slider longueur : visible seulement après un clic sur Générer */}
                        {hasGenerated && (
                            <div className='mt-4'>
                                <div className='flex items-center justify-between text-xs text-gray-600 mb-1'>
                                    <span>Longueur : {genLen}</span>
                                    <button
                                        type='button'
                                        onClick={handleGenerate}
                                        className='text-indigo-600 hover:underline'>
                                        Régénérer
                                    </button>
                                </div>
                                <input
                                    type='range'
                                    min={8}
                                    max={24}
                                    value={genLen}
                                    onChange={(e) =>
                                        setGenLen(Number(e.target.value))
                                    }
                                    className='w-full'
                                />
                            </div>
                        )}
                    </div>

                    {/* est_admin */}
                    <div className='flex items-center'>
                        <input
                            id='est_admin'
                            type='checkbox'
                            checked={estAdmin}
                            onChange={(e) => setEstAdmin(e.target.checked)}
                            className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                        />
                        <label
                            htmlFor='est_admin'
                            className='ml-2 text-sm text-gray-700'>
                            Compte administrateur
                        </label>
                    </div>

                    <div>
                        {/* Bouton d’inscription */}
                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-60'>
                            {loading ? "Création…" : "S’inscrire"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
