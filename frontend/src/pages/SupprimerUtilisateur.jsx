// SupprimerUtilisateur.jsx
// Permet à un administrateur de rechercher et supprimer un utilisateur via son ID


import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function SupprimerUtilisateur() {
  const { user, token } = useAuth();
  const [id, setId] = useState("");
  const [fetched, setFetched] = useState(null);
  const [deleted, setDeleted] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  // Vérifie si l'utilisateur est un administrateur
  if (!user || !user.est_admin) {
    return (
      <div className="px-5 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">Accès refusé</h1>
        <p className="mt-2 text-gray-600">
          Seuls les administrateurs peuvent supprimer des utilisateurs.
        </p>
      </div>
    );
  }

  // Fonction pour rechercher l'utilisateur par ID
  const handleFetch = async (e) => {
    e.preventDefault();
    setErr("");
    setDeleted(null);
    setFetched(null);
    if (!id.trim()) return setErr("ID requis");

    try {
      setLoading(true);
      const all = await api.getAllUsers(token); // Récupère tous les utilisateurs
      const u = all.find(p => p._id === id.trim());
      if (!u) throw new Error("Utilisateur introuvable");
      // Affiche les infos de l’utilisateur
      setFetched(u);

    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Si on clique sur le bouton de suppression
  // Supprime l'utilisateur et affiche ses infos
  const handleDelete = async () => {
    if (!fetched) return;
    setErr("");
    try {
      setLoading(true);
      // Copie locale pour l'affichage post-suppression
      const copy = { ...fetched };
      await api.deleteUser(fetched._id, token);
      // Memorise l'utilisateur supprimé
      setDeleted(copy);
      // Efface l'affichage de la carte
      setFetched(null);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  // Génère une carte d'infos utilisateur (hors mot de passe)
  const renderCard = (u) => {
    const entries = Object.entries(u).filter(
      ([k]) => !["mot_de_passe", "password", "hash", "__v"].includes(k.toLowerCase())
    );
    return (
      <div className="mt-6 p-5 rounded-xl border bg-white shadow-sm max-w-md">
        <h3 className="font-semibold text-gray-800 mb-3">Informations</h3>
        <ul className="space-y-1 text-sm text-gray-700">
          {entries.map(([k, v]) => (
            <li key={k}>
              <span className="font-medium">{k}:</span>{" "}
              {typeof v === "object" ? JSON.stringify(v) : String(v)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Affichage principal
  return (
    <div className="px-5 py-10 max-w-3xl mx-auto">
      {/* Titre */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Supprimer un utilisateur
      </h1>
      <p className="mt-2 text-gray-600">
        Entrez l’ID, vérifiez les infos, puis confirmez la suppression.
      </p>

      {/* Formulaire de recherche */}
      <form onSubmit={handleFetch} className="mt-6 flex gap-3">
        <input
          type="text"
          placeholder="ID de l'utilisateur"
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          Chercher
        </button>
      </form>

      {/* Messages d’état */}
      {err && <div className="mt-4 text-sm text-red-600 font-medium">{err}</div>}
      {loading && <div className="mt-4 text-gray-500">Chargement…</div>}

      {/* Affichage des infos utilisateur ou de la suppression */}
      {fetched && (
        <>
          {renderCard(fetched)}
          <button
            onClick={handleDelete}
            disabled={loading}
            className="mt-6 px-5 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            Supprimer définitivement
          </button>
        </>
      )}

      {/* Confirmation de la suppression */}
      {deleted && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold text-gray-800">
            Utilisateur supprimé :
          </h2>
          {renderCard(deleted)}
        </div>
      )}
    </div>
  );
}
