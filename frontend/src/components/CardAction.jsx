// Ce fichier définit un composant React réutilisable appelé `CardAction`.
// Il représente une carte interactive cliquable utilisée sur la page d’accueil
// pour rediriger vers différentes sections de l’application (ex: Mon profil, Mes utilisateurs, etc.).
// Chaque carte affiche une icône, un titre, une courte description et une flèche décorative.

import React from 'react'
import { Link } from 'react-router-dom'

// Composant CardAction : affiche une carte avec icône, titre, description et lien de navigation
export default function CardAction({ icon, title, desc, to }) {
  return (

    // Composant Link pour rediriger sans recharger la page 
    <Link
      to={to}
      className="
       group flex flex-col justify-between
      rounded-3xl bg-indigo-50 hover:bg-indigo-100
      transition-colors p-5 w-full
      shadow-sm border border-indigo-100
      focus:outline-none focus:ring-2 focus:ring-indigo-300
      "
    >
      {/* Contenu de la carte : icône, titre et description */}
      <div>
        <div className="text-3xl mb-3 select-none">{icon}</div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-600 leading-snug line-clamp-3">
          {desc}
        </p>
      </div>
      <div className="mt-4">
        <span
          className="
            inline-flex items-center justify-center
            w-10 h-10 rounded-xl border border-indigo-400
            text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white
            transition-colors
          "
        >
          <span className="text-lg">&#8594;</span>
        </span>
      </div>
    </Link>
  )
}
