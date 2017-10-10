// liste des requêtes lors des communications temps réels disponibles côté serveur.
export const REQUETE_SERVER_ENVOYER = 'envoyer';
export const REQUETE_SERVER_QUITTER = 'quitter';
export const REQUETE_SERVER_CREER_PARTIE_SOLO = 'partie/creer/solo';
export const REQUETE_SERVER_VERIFIER_MOT = 'partie/verifier/mot';

// liste des requêtes lors des communications temps réels disponibles côté client.
export const REQUETE_CLIENT_RAPPEL_QUITTER = 'rappelQuitter';
export const REQUETE_CLIENT_RAPPEL_CONNEXION = 'confirmationConnexion';
export const REQUETE_CLIENT_MESSAGE = 'messages';
export const REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO = 'partie/creer/solo/rappel';
export const REQUETE_CLIENT_RAPPEL_VERIFIER_MOT = 'partie/verifier/mot/rappel';
export const REQUETE_CLIENT_PARTIE_TERMINE = 'partie/termine';