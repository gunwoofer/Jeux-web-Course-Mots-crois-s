// liste des requêtes lors des communications temps réels disponibles côté serveur.
export const REQUETE_SERVEUR_ENVOYER = 'envoyer';
export const REQUETE_SERVEUR_QUITTER = 'quitter';
export const REQUETE_SERVEUR_CREER_PARTIE_SOLO = 'partie/creer/solo';
export const REQUETE_SERVEUR_VERIFIER_MOT = 'partie/verifier/mot';
export const REQUETE_SERVEUR_CHANGER_EMPLACEMENT_MOT_SELECTIONNER = 'partie/changer/emplacementmotselectionner';
export const REQUETE_SERVEUR_OBTENIR_TEMPS_RESTANT = 'partie/tempsrestant';
export const REQUETE_SERVEUR_OBTENIR_MOTS_TROUVES = 'partie/motstrouve';
export const REQUETE_SERVEUR_DEMANDE_LISTE_PARTIES_EN_COURS = 'parties/liste';
export const REQUETE_SERVEUR_MODIFIER_TEMPS_RESTANT = 'partie/modifiertempsrestant';
export const REQUETE_SERVER_OBTENIR_MOTS_COMPLETS_CHEAT_MODE = 'partie/obtenir/motscomplets';
export const REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR = 'partie/creer/multijoueur';
export const REQUETE_SERVEUR_JOINDRE_PARTIE = 'partie/joindre';


// liste des requêtes lors des communications temps réels disponibles côté client.
export const REQUETE_CLIENT_RAPPEL_QUITTER = 'rappelQuitter';
export const REQUETE_CLIENT_RAPPEL_CONNEXION = 'confirmationConnexion';
export const REQUETE_CLIENT_MESSAGE = 'messages';
export const REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO = 'partie/creer/solo/rappel';
export const REQUETE_CLIENT_RAPPEL_VERIFIER_MOT = 'partie/verifier/mot/rappel';
export const REQUETE_CLIENT_PARTIE_TERMINE = 'partie/termine';
export const REQUETE_CLIENT_RAPPEL_CHANGER_EMPLACEMENT_MOT_SELECTIONNER = 'partie/changer/emplacementmotselectionner/rappel';
export const REQUETE_CLIENT_ADVERSAIRE_CHANGER_EMPLACEMENT_MOT_SELECTIONNER = 'partie/changer/emplacementmotselectionner/adversaire';
export const REQUETE_CLIENT_OBTENIR_TEMPS_RESTANT_RAPPEL = 'partie/tempsrestant/rappel';
export const REQUETE_CLIENT_OBTENIR_MOTS_TROUVE_RAPPEL = 'partie/motstrouve/rappel';
export const REQUETE_CLIENT_DEMANDE_LISTE_PARTIES_EN_COURS_RAPPEL = 'parties/liste/rappel';
export const REQUETE_CLIENT_RAPPEL_OBTENIR_MOTS_COMPLETS_CHEAT_MODE = 'partie/obtenir/motscomplets/rappel';
export const REQUETE_CLIENT_MODIFIER_TEMPS_RESTANT_RAPPEL = 'partie/modifiertempsrestant/rappel';
export const REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR_RAPPEL = 'partie/creer/multijoueur/rappel';
export const REQUETE_SERVEUR_JOINDRE_PARTIE_RAPPEL = 'partie/joindre/rappel';