import Utilisateur from "../modeles/Utilisateur.js";
import bcrypt from "bcrypt";
import { verifierCourriel } from "../services/verificateurCourrielApi.js";

//---------- Fonction pour gérer l'inscription d'un nouvel utilisateur ---------
export async function creerProfil(req, res) {
    // Extraire les champs envoyés dans le corps de la requête
    const pseudo = req.body.pseudo;
    const courriel = req.body.courriel;
    const mot_de_passe = req.body.mot_de_passe;
    const est_admin = req.body.est_admin;

    // Vérifier le courriel avec l'API externe
    const courriel_valide = await verifierCourriel(courriel);
    if (!courriel_valide) {
        return res
            .status(400)
            .json({ message: "Le courriel est invalide selon l'API." });
    }

    // Vérifier si un utilisateur avec le même courriel existe déjà dans la base
    Utilisateur.findOne({ courriel: courriel })
        .then((utilisateur) => {
            // Si un utilisateur est trouvé, on retourne une erreur 409 (conflit)
            if (utilisateur) {
                return res
                    .status(409)
                    .json({ message: "Le courriel est déjà utilisé." });
            }

            // Si aucun utilisateur n'est trouvé, on peut hasher le mot de passe
            bcrypt.hash(mot_de_passe, 10).then((mot_de_passe_hache) => {
                // Créer un nouvel objet Utilisateur avec le mot de passe haché
                const nouvel_utilisateur = new Utilisateur({
                    pseudo: pseudo,
                    courriel: courriel,
                    mot_de_passe: mot_de_passe_hache,
                    est_admin: est_admin,
                });

                // Enregistrer le nouvel utilisateur dans la base de données
                nouvel_utilisateur
                    .save()
                    .then((utilisateur_enregistre) => {
                        res.status(201).json({
                            message: "Utilisateur créé avec succès !",
                            utilisateur: {
                                _id: utilisateur_enregistre._id,
                                pseudo: utilisateur_enregistre.pseudo,
                                courriel: utilisateur_enregistre.courriel,
                                est_admin: utilisateur_enregistre.est_admin,
                            },
                        });
                    })
                    .catch((erreur) => {
                        console.log("Erreur lors du save() :", erreur);
                        res.status(400).json({
                            message:
                                "Erreur lors de l'enregistrement de l'utilisateur",
                            erreur: erreur,
                        });
                    });
            });
        })
        // Si une erreur survient lors de la recherche initiale (MongoDB), on
        // retourne une erreur 500 (serveur)
        .catch((erreur) => {
            console.log("Erreur serveur :", erreur);
            res.status(500).json({ message: "Erreur serveur", erreur: erreur });
        });
}

//---------- Fonction pour lire tous les utilisateurs ----------
export function lireTous(req, res) {
    // Méthode Mongoose pour aller chercher tous les utilisateurs, et on obtient
    // le résultat dans utilisateurs
    Utilisateur.find()
        .then((utilisateurs) => {
            res.status(200).json(utilisateurs); // Retourne la liste complète
        })
        .catch((erreur) => {
            res.status(500).json({ message: "Erreur serveur", erreur });
        });
}

//---------- Fonction pour supprimer un utilisateur ----------
export function supprimer(req, res) {
    // Récupérer l'id du profil à modifier
    const id = req.params.id;

    // Chercher l'utilisateur à supprimer
    Utilisateur.findById(id)
        .then((utilisateur) => {
            if (!utilisateur) {
                return res
                    .status(404)
                    .json({ message: "Utilisateur non trouvé" });
            }

            // Infos à afficher avant la suppression (sans le mot de passe)
            const infosUtilisateur = {
                _id: utilisateur._id,
                pseudo: utilisateur.pseudo,
                courriel: utilisateur.courriel,
                est_admin: utilisateur.est_admin,
            };

            // Supprimer l'utilisateur
            Utilisateur.findByIdAndDelete(id)
                .then(() => {
                    res.status(200).json({
                        message: "Utilisateur supprimé avec succès",
                        utilisateur: infosUtilisateur,
                    });
                })
                .catch((erreur) => {
                    res.status(500).json({
                        message: "Erreur lors de la suppression",
                        erreur: erreur.message,
                    });
                });
        })
        .catch((erreur) => {
            res.status(500).json({
                message: "Erreur lors de la recherche de l'utilisateur",
                erreur: erreur.message,
            });
        });
}

//---------- Fonction pour lire un seul utilisateur ----------
export function lireUn(req, res) {
    const id = req.params.id;

    // Cherche un utilisateur à l'aide de l'Id
    Utilisateur.findById(id)
        .then((utilisateur) => {
            if (!utilisateur) {
                return res
                    .status(404)
                    .json({ message: "Utilisateur non trouvé" });
            }

            // On retourne les infos (sans le mot de passe)
            res.status(200).json({
                _id: utilisateur._id,
                pseudo: utilisateur.pseudo,
                courriel: utilisateur.courriel,
                est_admin: utilisateur.est_admin,
            });
        })
        .catch((erreur) => {
            res.status(500).json({
                message: "Erreur serveur",
                erreur: erreur.message,
            });
        });
}

//---------- Fonction pour modifier un profil ----------
export async function modifier(req, res) {
    // Récupérer l'id du profil à modifier
    const id = req.params.id;

    // Extraire les champs qui peuvent être modifiés
    const { pseudo, courriel, mot_de_passe } = req.body;

    // Vérifier le courriel avec l'API externe
    const courriel_valide = await verifierCourriel(courriel);
    if (!courriel_valide) {
        return res
            .status(400)
            .json({ message: "Le courriel est invalide selon l'API." });
    }

    // 1. Vérifier si le courriel est utilisé par un autre utilisateur
    Utilisateur.findOne({ courriel: courriel })
        .then((utilisateur_existant) => {
            // Vérifier si c'est un autre utilisateur qui a le courriel
            if (
                utilisateur_existant &&
                utilisateur_existant._id.toString() !== id
            ) {
                return res.status(409).json({
                    message:
                        "Ce courriel est déjà utilisé par un autre compte.",
                });
            }

            // 2. Si un nouveau mot de passe est fourni, on le hash
            const hashPromise = mot_de_passe
                ? bcrypt.hash(mot_de_passe, 10)
                : Promise.resolve(null);

            // 3. Une fois le hash obtenu
            hashPromise.then((mot_de_passe_hache) => {
                // Créer l’objet contenant les champs à mettre à jour
                const mise_a_jour = {
                    pseudo,
                    courriel,
                };

                // Ajouter le mot de passe haché juste s'il a été changé
                if (mot_de_passe_hache) {
                    mise_a_jour.mot_de_passe = mot_de_passe_hache;
                }

                // 4. Mettre à jour l’utilisateur dans la base de données
                Utilisateur.findByIdAndUpdate(id, mise_a_jour, { new: true })
                    .then((utilisateur_modifie) => {
                        // Si aucun utilisateur n'est trouvé avec l'ID
                        if (!utilisateur_modifie) {
                            return res
                                .status(404)
                                .json({ message: "Utilisateur non trouvé" });
                        }

                        // Sinon, on renvoie les infos du profil mis à jour (sans le mot de passe)
                        res.status(200).json({
                            message: "Profil modifié avec succès !",
                            utilisateur: {
                                _id: utilisateur_modifie._id,
                                pseudo: utilisateur_modifie.pseudo,
                                courriel: utilisateur_modifie.courriel,
                                est_admin: utilisateur_modifie.est_admin,
                            },
                        });
                    })
                    // Erreur si la mise à jour échoue (problème MongoDB, etc.)
                    .catch((erreur) => {
                        res.status(500).json({
                            message: "Erreur lors de la mise à jour du profil",
                            erreur: erreur.message,
                        });
                    });
            });
        })
        // Erreur si la vérification du courriel échoue (ex : problème de requête)
        .catch((erreur) => {
            res.status(500).json({
                message: "Erreur lors de la vérification du courriel",
                erreur: erreur.message,
            });
        });
}
