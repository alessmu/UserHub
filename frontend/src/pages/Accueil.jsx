// Accueil.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CardAction from "../components/CardAction.jsx";

export default function Accueil() {
    const { user } = useAuth();

    // Visiteur (non connecté)
    if (!user) {
        return (
            <div className='px-5 py-12 max-w-5xl mx-auto'>
                <header className='text-center max-w-2xl mx-auto'>
                    <h1 className='text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight'>
                        Gérez vos profils simplement & en toute sécurité
                    </h1>
                    <p className='mt-4 text-gray-600 text-base sm:text-lg leading-relaxed'>
                        Plateforme de gestion de profils : inscription rapide,
                        validation de courriel et générateur intégré de mots de
                        passe.
                    </p>
                </header>

                {/* Boutons inscription / connexion */}
                <div className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'>
                    <Link
                        to='/inscription'
                        className='inline-flex items-center justify-center px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition'>
                        S&apos;inscrire
                    </Link>
                    <Link
                        to='/connexion'
                        className='inline-flex items-center justify-center px-6 py-3 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition'>
                        Se connecter
                    </Link>
                </div>

                {/* Trois fonctionnalités clés */}
                <div className='mt-14 grid gap-6 sm:grid-cols-3'>
                    {/*  1 : Validation courriel */}
                    <div className='p-5 rounded-xl border bg-white'>
                        <h3 className='font-semibold text-gray-800'>
                            Validation courriel
                        </h3>
                        <p className='mt-1 text-sm text-gray-600'>
                            Email vérifié via API externe.
                        </p>
                    </div>
                    {/* 2 : Hashage bcrypt */}
                    <div className='p-5 rounded-xl border bg-white'>
                        <h3 className='font-semibold text-gray-800'>
                            Sécurité
                        </h3>
                        <p className='mt-1 text-sm text-gray-600'>
                            Hashage bcrypt des mots de passe.
                        </p>
                    </div>
                    {/* 3 : Générateur de mot de passe */}
                    <div className='p-5 rounded-xl border bg-white'>
                        <h3 className='font-semibold text-gray-800'>
                            Générateur intégré
                        </h3>
                        <p className='mt-1 text-sm text-gray-600'>
                            Crée un mot de passe en 1 clic.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Utilisateur non admin
    if (!user.est_admin) {
        return (
            <div className='px-5 py-10 max-w-6xl mx-auto'>
                <div className='max-w-2xl'>
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-800'>
                        Bonjour,{" "}
                        <span className='text-indigo-600'>{user.pseudo}</span>
                    </h1>
                    <p className='mt-3 text-gray-600'>
                        Ton tableau de bord : vérifie tes données, ajuste-les et
                        reste informé des fonctionnalités.
                    </p>
                </div>

                {/* Actions accessibles à l’utilisateur */}
                <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {/* 1 : Voir mon profil */}
                    <CardAction
                        icon={
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                height='24'
                                viewBox='0 -960 960 960'
                                width='24'
                                fill='#000000ff'>
                                <path d='M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z' />
                            </svg>
                        }
                        title='Voir mon profil'
                        desc='Infos de ton compte.'
                        to={`/profils/${user._id}`}
                    />
                    {/* 2 : Modifier mon profil */}
                    <CardAction
                        icon={
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                height='24'
                                viewBox='0 -960 960 960'
                                width='24'
                                fill='#000000ff'>
                                <path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z' />
                            </svg>
                        }
                        title='Modifier mon profil'
                        desc='Met à jour tes données.'
                        to={{
                            pathname: "/profils/${user._id}`}",
                            state: { edit: true },
                        }}
                    />
                    {/* 3 : Supprimer mon compte */}
                    <CardAction
                        icon={
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                height='24'
                                width='24'
                                viewBox='0 -960 960 960'
                                fill='#000000ff'>
                                <path d='M300-80q-58 0-99-41t-41-99v-520q0-58 41-99t99-41h500v600q-25 0-42.5 17.5T740-220q0 25 17.5 42.5T800-160v80H300Zm-60-267q14-7 29-10t31-3h20v-440h-20q-25 0-42.5 17.5T240-740v393Zm160-13h320v-440H400v440Zm-160 13v-453 453Zm60 187h373q-6-14-9.5-28.5T660-220q0-16 3-31t10-29H300q-26 0-43 17.5T240-220q0 26 17 43t43 17Z' />
                            </svg>
                        }
                        title='Documentation'
                        desc='Routes disponibles.'
                        to='/documentation'
                    />
                    {/* 4 : Liste des utilisateurs */}
                    <CardAction
                        icon={
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                height='24'
                                viewBox='0 -960 960 960'
                                width='24'
                                fill='#000000ff'>
                                <path d='M80-160v-160h160v160H80Zm240 0v-160h560v160H320ZM80-400v-160h160v160H80Zm240 0v-160h560v160H320ZM80-640v-160h160v160H80Zm240 0v-160h560v160H320Z' />
                            </svg>
                        }
                        title='Liste des utilisateurs'
                        desc='Consulte les comptes enregistrés.'
                        to='/profils'
                    />
                    {/* 5 : Supprimer un utilisateur */}
                    <CardAction
                        icon={
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                height='24'
                                width='24'
                                viewBox='0 -960 960 960'
                                fill='#000000ff'>
                                <path d='M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z' />
                            </svg>
                        }
                        title='Supprimer un utilisateur'
                        desc='Gestion des comptes.'
                        to='/supprimer'
                    />
                </div>
            </div>
        );
    }

    // Admin
    return (
        <div className='px-5 py-10 max-w-7xl mx-auto'>
            <div className='max-w-3xl'>
                <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3'>
                    Bonjour,{" "}
                    <span className='text-indigo-600'>{user.pseudo}</span>
                    <span className='px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600'>
                        Admin
                    </span>
                </h1>
                <p className='mt-3 text-gray-600'>
                    Tableau de bord administrateur : gérez les comptes et
                    accédez à la documentation complète.
                </p>
            </div>

            {/* Actions accessibles à l’admin */}
            <div className='mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {/* 1 : Voir mon profil */}
                <CardAction
                    icon={
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='24'
                            viewBox='0 -960 960 960'
                            width='24'
                            fill='#000000ff'>
                            <path d='M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z' />
                        </svg>
                    }
                    title='Voir mon profil'
                    desc='Ton profil.'
                    to={`/profils/${user._id}`}
                />
                {/* 2 : Modifier mon profil */}
                <CardAction
                    icon={
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='24'
                            viewBox='0 -960 960 960'
                            width='24'
                            fill='#000000ff'>
                            <path d='M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z' />
                        </svg>
                    }
                    title='Modifier mon profil'
                    desc='Changer tes infos.'
                    to={{
                        pathname: "/profils/${user._id}`}",
                        state: { edit: true },
                    }}
                />
                {/* 3 : Liste des utilisateurs */}
                <CardAction
                    icon={
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='24'
                            viewBox='0 -960 960 960'
                            width='24'
                            fill='#000000ff'>
                            <path d='M80-160v-160h160v160H80Zm240 0v-160h560v160H320ZM80-400v-160h160v160H80Zm240 0v-160h560v160H320ZM80-640v-160h160v160H80Zm240 0v-160h560v160H320Z' />
                        </svg>
                    }
                    title='Liste des utilisateurs'
                    desc='Tous les comptes.'
                    to='/profils'
                />
                {/* 4 : Supprimer un utilisateur */}
                <CardAction
                    icon={
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='24'
                            width='24'
                            viewBox='0 -960 960 960'
                            fill='#000000ff'>
                            <path d='M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360Z' />
                        </svg>
                    }
                    title='Supprimer un utilisateur'
                    desc='Gestion des comptes.'
                    to='/supprimer'
                />
                {/* 5 : Documentation */}
                <CardAction
                    icon={
                        <svg
                            xmlns='http://www.w3.org/2000/svg'
                            height='24'
                            width='24'
                            viewBox='0 -960 960 960'
                            fill='#000000ff'>
                            <path d='M300-80q-58 0-99-41t-41-99v-520q0-58 41-99t99-41h500v600q-25 0-42.5 17.5T740-220q0 25 17.5 42.5T800-160v80H300Zm-60-267q14-7 29-10t31-3h20v-440h-20q-25 0-42.5 17.5T240-740v393Zm160-13h320v-440H400v440Zm-160 13v-453 453Zm60 187h373q-6-14-9.5-28.5T660-220q0-16 3-31t10-29H300q-26 0-43 17.5T240-220q0 26 17 43t43 17Z' />
                        </svg>
                    }
                    title='Documentation'
                    desc='Toutes les routes.'
                    to='/documentation'
                />
            </div>
        </div>
    );
}
