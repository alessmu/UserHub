// Profil.jsx
// Affichage et modification du profil utilisateur connecté

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { useParams } from "react-router-dom";

export default function Profil() {
    const { id } = useParams(); // pour /profils/:id
    const { user, setAuthData, token } = useAuth();
    const location = useLocation();
    const startEdit = location.state?.edit === true;
    const [edit, setEdit] = useState(startEdit);

    // États pour les champs à éditer
    const [pseudo, setPseudo] = useState(user?.pseudo || "");
    const [courriel, setCourriel] = useState(user?.courriel || "");
    const [pwd, setPwd] = useState(""); // Nouveau mot de passe (optionnel)
    const [showPwd, setShowPwd] = useState(false); // Afficher/Masquer mot de passe

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [msg, setMsg] = useState(null);

    // Si pas d'utilisateur connecté, afficher un message d'erreur
    if (!user) return <p className='p-6 text-red-600'>Accès refusé.</p>;

    //Mise à jour du profil (PUT /profils/:id)
    async function handleSave(e) {
        e.preventDefault();
        setErr(null);
        setMsg(null);
        setLoading(true);
        try {
            await api.updateUser(
                user._id,
                { pseudo, courriel, mot_de_passe: pwd || undefined },
                token
            );
            // Mettre à jour les données utilisateur dans le localStorage et le contexte
            const newUser = { ...user, pseudo, courriel };
            localStorage.setItem("user", JSON.stringify(newUser));
            setAuthData(newUser, token);
            setMsg("Profil mis à jour!");
            setEdit(false);
            setPwd("");
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    /*  UI */

    return (
        <div className='flex flex-col items-center px-4 py-8 mt-20'>
            {/* Bannière claire avec avatar  */}
            <div
                className='w-full max-w-xl rounded-3xl bg-indigo-50
                      border border-indigo-100
                      text-gray-800 pt-10 pb-6 px-6 relative'>
                <div className='flex justify-center'>
                    <img
                        src={
                            user.avatarUrl ||
                            "https://raw.githubusercontent.com/primer/octicons/main/icons/person-24.svg"
                        }
                        alt='avatar'
                        className='w-24 h-24 rounded-full border-4 border-indigo-200 bg-white object-cover shadow-md'
                    />
                </div>
                <h1 className='mt-4 text-center text-2xl font-semibold'>
                    {user.pseudo}
                </h1>
                <p className='text-center text-sm opacity-80'>
                    {user.est_admin
                        ? "Administrateur·rice"
                        : "Utilisateur·rice"}
                </p>
            </div>

            {/* Carte blanche avec les infos et formulaire */}
            <div className='-mt-9 pt-10 w-full max-w-xl bg-white border rounded-2xl shadow p-6'>
                {/* Affichage lecture seule */}
                {!edit && (
                    <>
                        <Info label='ID' value={user._id} />
                        <Info label='Pseudo' value={user.pseudo} />
                        <Info label='Courriel' value={user.courriel} />
                        <Info
                            label='Rôle'
                            value={user.est_admin ? "Admin" : "Utilisateur"}
                        />

                        {msg && (
                            <p className='mt-4 text-green-600 text-sm'>{msg}</p>
                        )}

                        <div className='mt-6 flex justify-end'>
                            <button
                                onClick={() => setEdit(true)}
                                className='px-5 py-2 rounded-md bg-indigo-600 text-white
                           hover:bg-indigo-700 transition-colors'>
                                Modifier
                            </button>
                        </div>
                    </>
                )}

                {/*Formulaire de modification  */}
                {edit && (
                    <form onSubmit={handleSave} className='space-y-4'>
                        {err && <p className='text-red-600 text-sm'>{err}</p>}

                        <Field label='Pseudo' val={pseudo} setVal={setPseudo} />
                        <Field
                            label='Courriel'
                            val={courriel}
                            setVal={setCourriel}
                            type='email'
                        />

                        {/* Nouveau mot de passe (optionnel) */}
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-1'>
                                Nouveau mot de passe
                            </label>
                            <div className='flex gap-2'>
                                <input
                                    type={showPwd ? "text" : "password"}
                                    value={pwd}
                                    onChange={(e) => setPwd(e.target.value)}
                                    placeholder='Laisse vide pour ne pas changer'
                                    className='flex-1 rounded-md border px-3 py-2'
                                />
                                <button
                                    type='button'
                                    onClick={() => setShowPwd((s) => !s)}
                                    className='text-sm px-3 rounded-md border'>
                                    {showPwd ? "Masquer" : "Afficher"}
                                </button>
                            </div>
                        </div>

                        {/* Boutons Annuler / Enregistrer */}
                        <div className='flex justify-end gap-3 pt-2'>
                            <button
                                type='button'
                                onClick={() => {
                                    setEdit(false);
                                    setErr(null);
                                }}
                                className='px-4 py-2 text-gray-700 border rounded-md'>
                                Annuler
                            </button>
                            <button
                                disabled={loading}
                                className='px-5 py-2 rounded-md bg-indigo-600 text-white
                           hover:bg-indigo-700 disabled:opacity-60'>
                                {loading ? "Enregistrement…" : "Enregistrer"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

/* Sous‑composant Info (mode lecture) */

function Info({ label, value }) {
    return (
        <div className='mb-4'>
            <p className='text-xs uppercase tracking-wide text-gray-500'>
                {label}
            </p>
            <p className='text-gray-800 break-words'>{value}</p>
        </div>
    );
}

/*Champ de formulaire (mode édition) */
function Field({ label, val, setVal, type = "text" }) {
    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
                {label}
            </label>
            <input
                type={type}
                value={val}
                onChange={(e) => setVal(e.target.value)}
                className='w-full rounded-md border px-3 py-2'
                required
            />
        </div>
    );
}
