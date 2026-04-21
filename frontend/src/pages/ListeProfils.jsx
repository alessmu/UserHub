// ListeProfils.jsx
// Liste complète + recherche locale par ID

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function ListeProfils() {
    const { user, token } = useAuth();
    const [profilsComplet, setProfilsComplet] = useState([]);
    const [profilsAffiches, setProfilsAffiches] = useState([]);
    const [rechercheId, setRechercheId] = useState("");
    const [erreur, setErreur] = useState("");
    const [loading, setLoading] = useState(false);

    if (!user || !user.est_admin) {
        return (
            <div className='p-8 text-center'>
                <h1 className='text-2xl font-semibold text-red-600 mb-4'>
                    Accès refusé
                </h1>
                <p className='text-gray-700'>
                    Seuls les admins peuvent voir la liste des profils utilisateurs.
                </p>
            </div>
        );
    }

    // On récupère la liste des utilisateurs au chargement
    useEffect(() => {
        setLoading(true);
        api.getAllUsers(token)
            .then((data) => {
                setProfilsComplet(data); // On garde tous les utilisateurs
                setProfilsAffiches(data); // affichage initial
            })
            .catch((e) => setErreur(e.message))
            .finally(() => setLoading(false));
    }, [token]);

    // Fonction appelée lors de la recherche pour filtrer l'utilisateur avec
    // l'ID recherché
    function filtrer(e) {
        e.preventDefault();
        setErreur("");
        const idRecherche = rechercheId.trim();
        if (idRecherche === "") {
            // Si le champs est vide, on affiche tout
            setProfilsAffiches(profilsComplet);
        } else {
            // Sinon on filtre localement selon l'ID
            const match = profilsComplet.filter((p) => p._id === idRecherche);
            setProfilsAffiches(match);
        }
    }

    return (
        <div className='p-8 w-full max-w-6xl mx-auto overflow-x-auto'>
            <h1 className='text-2xl font-semibold text-gray-800 mb-6'>
                Liste des utilisateurs
            </h1>

            {/* Barre de recherche */}
            <form onSubmit={filtrer} className='flex items-center gap-4 mb-4'>
                <div className='flex-1'>
                    <label className='block text-gray-800 mb-1'>
                        Rechercher par ID (laisser vide pour tout voir)
                    </label>
                    <input
                        type='text'
                        className='w-full border px-4 py-2 rounded-md'
                        placeholder='Ex: 64bcf2...'
                        value={rechercheId}
                        onChange={(e) => setRechercheId(e.target.value)}
                    />
                </div>
                <button
                    type='submit'
                    className='bg-indigo-600 text-white px-4 py-2 mt-6 rounded-md hover:bg-indigo-700 transition'>
                    Rechercher
                </button>
            </form>

            {/* États de chargement ou d’erreur */}
            {erreur && <p className='text-red-600 mb-4'>Erreur: {erreur}</p>}
            {loading && <p className='text-gray-600 mb-4'>Chargement...</p>}

            {/* Tableau des résultats */}
            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white shadow-md rounded-md overflow-hidden'>
                    <thead className='bg-gray-100 text-left'>
                        <tr>
                            <th className='pl-3 pr-2 py-2 w-60'>ID</th>
                            <th className='pl-48 pr-2 py-2'>Pseudo</th>
                            <th className='pl-14 pr-2 py-2'>Courriel</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profilsAffiches.map((p) => (
                            <tr
                                key={p._id}
                                className='border-t hover:bg-indigo-600/10 transition-colors'>
                                <td className='pl-3 pr-2 py-2 text-sm'>
                                    {p._id}
                                </td>
                                <td className='pl-48 pr-2 py-2'>{p.pseudo}</td>
                                <td className='pl-14 pr-2 py-2'>
                                    {p.courriel}
                                </td>
                            </tr>
                        ))}
                        {/* Si aucun utilisateur trouvé */}
                        {profilsAffiches.length === 0 && (
                            <tr>
                                <td
                                    colSpan='3'
                                    className='text-center px-4 py-6 text-gray-500'>
                                    Aucun utilisateur trouvé.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
