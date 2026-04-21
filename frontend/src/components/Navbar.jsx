// Ce composant affiche la barre de navigation en haut du site.
// Il adapte dynamiquement le contenu selon que l’utilisateur est connecté ou non.
// Il propose des liens vers l’accueil, l’inscription, la connexion ou le profil, ainsi qu’un menu déroulant avec déconnexion.

import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar({ onLogout }) {
    // État pour gérer l'ouverture/fermeture du menu déroulant
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { user } = useAuth();

    // Fonction qui retourne une classe CSS personnalisée pour chaque lien de navigation
    function navLinkClass({ isActive }) {
        return `
      group relative px-3 py-2 font-medium text-sm
      text-gray-700 hover:text-indigo-700 transition
      after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full
      after:origin-left after:scale-x-0 after:bg-indigo-600 after:transition-transform
      group-hover:after:scale-x-100
      ${isActive ? "text-indigo-700 after:scale-x-100" : ""}
    `;
    }

    return (
        // Barre de navigation principale
        // Utilisation de classes Tailwind CSS pour le style
        <nav className='bg-white border-b border-gray-200 shadow-sm'>
            {/* Plus de max-width : liens vraiment collés à gauche (padding horizontal) */}
            <div className='w-full flex items-center justify-between px-6 py-3'>
                <div className='flex items-center space-x-6'>
                    <NavLink to='/' className={navLinkClass}>
                        Accueil
                    </NavLink>
                    {!user && (
                        <>
                            {/* Liens d'inscription et de connexion */}
                            <NavLink to='/inscription' className={navLinkClass}>
                                Inscription
                            </NavLink>
                            <NavLink to='/connexion' className={navLinkClass}>
                                Connexion
                            </NavLink>
                        </>
                    )}
                    {/* Lien vers le profil si l'utilisateur est connecté */}
                    {user && (
                        <NavLink
                            to={`/profils/${user._id}`}
                            className={navLinkClass}>
                            Mon profil
                        </NavLink>
                    )}
                </div>

                {user && (
                    <div className='relative'>
                        <button
                            onClick={() => setDropdownOpen((o) => !o)}
                            className='flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 py-1'>
                            <img
                                src={
                                    user.avatarUrl ||
                                    "https://raw.githubusercontent.com/primer/octicons/main/icons/person-24.svg"
                                }
                                alt='avatar'
                                className='w-9 h-9 rounded-full border border-gray-300 object-cover'
                            />

                            {/* Affichage du pseudo de l'utilisateur et de son statut d'admin */}
                            <span className='ml-2 text-gray-700 font-medium flex items-center'>
                                {user.pseudo}
                                {user.est_admin && (
                                    <span className='ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold'>
                                        Admin
                                    </span>
                                )}
                            </span>
                            <svg
                                className={`ml-2 w-4 h-4 text-gray-500 transition-transform ${
                                    dropdownOpen ? "rotate-180" : ""
                                }`}
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M19 9l-7 7-7-7'
                                />
                            </svg>
                        </button>
                        {/* Menu déroulant avec options de profil et déconnexion */}
                        {dropdownOpen && (
                            <div className='absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg z-20 overflow-hidden'>
                                <Link
                                    // Redirection vers le profil de l'utilisateur
                                    to={`/profils/${user._id}`}
                                    onClick={() => setDropdownOpen(false)}
                                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'>
                                    Mon profil
                                </Link>
                                <button
                                    onClick={() => {
                                        setDropdownOpen(false);
                                        onLogout && onLogout();
                                    }}
                                    className='w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'>
                                    Déconnexion
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
