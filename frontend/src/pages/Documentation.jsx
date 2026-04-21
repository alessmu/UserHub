// Documentation.jsx
import React from "react";

// Base de l'URL de l'API
const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Liste des routes de l'API
// Chaque route contient : méthode, chemin, description, corps de la requête, exemple curl
const ROUTES = [
  {
    method: "POST",
    path: "/connexion",
    desc: "Authentifie un utilisateur. Retourne un token JWT et son id.",
    body: { courriel: "naromba.conde@umontreal.ca", mot_de_passe: "secret" },
    curl: `curl -X POST "${BASE}/connexion" -H "Content-Type: application/json" -d '{"courriel":"naromba.conde@umontreal.ca","mot_de_passe":"secret"}'`,
    resp: { userId: "687d41ec08c98634b3890a89", token: "eyJhbGciOi..." },
  },
  {
    method: "POST",
    path: "/profils",
    desc: "Créer un utilisateur.",
    body: {
      pseudo: "Naro",
      courriel: "naromba.conde@umontreal.ca",
      mot_de_passe: "Secret123!",
      est_admin: false,
    },
    curl: `curl -X POST "${BASE}/profils" -H "Content-Type: application/json" -d '{"pseudo":"Naro","courriel":"naromba.conde@umontreal.ca","mot_de_passe":"Secret123!","est_admin":false}'`,
    resp: {
      message: "Utilisateur créé avec succès !",
      utilisateur: {
        _id: "687d41ec08c98634b3890a89",
        pseudo: "Naro",
        courriel: "naromba.conde@umontreal.ca",
        est_admin: false,
      },
    },
  },
  {
    method: "GET",
    path: "/profils",
    auth: "Admin",
    desc: "Liste tous les utilisateurs.",
    curl: `curl -X GET "${BASE}/profils" -H "Authorization: Bearer <TOKEN>"`,
    resp: [
      {
        _id: "687d41ec08c98634b3890a89",
        pseudo: "Naro",
        courriel: "naromba.conde@umontreal.ca",
        est_admin: false,
      },
      {
        _id: "68826c1d8369361b7955243f",
        pseudo: "alessia.muresan",
        courriel: "alessia.muresan@umontreal.ca",
        est_admin: false,
      },
    ],
  },
  {
    method: "GET",
    path: "/profils/:id",
    auth: "Proprio ou Admin",
    desc: "Retourne un utilisateur (sans mot_de_passe).",
    curl: `curl -X GET "${BASE}/profils/68826c1d8369361b7955243f" -H "Authorization: Bearer <TOKEN>"`,
    resp: {
      _id: "68826c1d8369361b7955243f",
      pseudo: "alessia.muresan",
      courriel: "alessia.muresan@umontreal.ca",
      est_admin: false,
    },
  },
  {
    method: "PUT",
    path: "/profils/:id",
    auth: "Proprio ou Admin",
    desc: "Modifie un profil. Renvoie le profil modifié.",
    body: { pseudo: "Naro2", courriel: "naromba.conde@umontreal.ca", mot_de_passe: "Nouveau123!" },
    curl: `curl -X PUT "${BASE}/profils/687d41ec08c98634b3890a89" -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"pseudo":"Naro2","courriel":"naromba.conde@umontreal.ca","mot_de_passe":"Nouveau123!"}'`,
    resp: {
      message: "Profil mis à jour!",
      utilisateur: {
        _id: "687d41ec08c98634b3890a89",
        pseudo: "Naro2",
        courriel: "naromba.conde@umontreal.ca",
        est_admin: false,
      },
    },
  },
  {
    method: "DELETE",
    path: "/profils/:id",
    auth: "Admin",
    desc: "Supprime un utilisateur et renvoie ses infos (sans mot_de_passe).",
    curl: `curl -X DELETE "${BASE}/profils/68826c1d8369361b7955243f" -H "Authorization: Bearer <TOKEN>"`,
    resp: {
      message: "Utilisateur supprimé",
      utilisateur: {
        _id: "68826c1d8369361b7955243f",
        pseudo: "alessia.muresan",
        courriel: "alessia.muresan@umontreal.ca",
        est_admin: false,
      },
    },
  },
  {
    method: "GET",
    path: "/motdepasse/:len",
    desc: "Génère un mot de passe aléatoire de longueur len.",
    curl: `curl -X GET "${BASE}/motdepasse/12"`,
    resp: { mot_de_passe: "G7t@1Kp9" },
  },
];

// Composant pour afficher un bloc de code avec style
function CodeBlock({ children }) {
  return (
    <pre className="mt-2 bg-gray-100 p-3 rounded text-xs overflow-auto whitespace-pre-wrap">
      {children}
    </pre>
  );
}

// Composant principal de la documentation
export default function Documentation() {
  return (
    <div className="px-5 py-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Documentation de l’API REST
      </h1>

      {/* Boucle sur chaque route de l’API et affiche les détails */}
      <div className="space-y-10">
        {ROUTES.map((r, i) => (
          <div key={i} className="border rounded-xl bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-md text-white text-xs font-semibold bg-indigo-600">
                {r.method}
              </span>
              <code className="text-sm text-gray-800">{r.path}</code>

              {/* Type d’auth requis  */}
              {r.auth && (
                <span className="ml-auto text-xs text-gray-500">
                  Auth: {r.auth}
                </span>
              )}
            </div>

            {/* Description de la route */}
            <p className="mt-3 text-sm text-gray-700">{r.desc}</p>

            {/* Corps de la requête  */}
            {r.body && (
              <>
                <h4 className="mt-5 text-sm font-semibold text-gray-800">
                  Exemple de corps (JSON)
                </h4>
                <CodeBlock>{JSON.stringify(r.body, null, 2)}</CodeBlock>
              </>
            )}

            {/* Exemple curl */}
            <h4 className="mt-5 text-sm font-semibold text-gray-800">
              Exemple d’appel curl
            </h4>
            <CodeBlock>{r.curl}</CodeBlock>
            
            {/* Exemple de réponse  */}
            <h4 className="mt-5 text-sm font-semibold text-gray-800">
              Exemple de réponse
            </h4>
            <CodeBlock>{JSON.stringify(r.resp, null, 2)}</CodeBlock>
          </div>
        ))}
      </div>
    </div>
  );
}
