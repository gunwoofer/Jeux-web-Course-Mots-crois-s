
// Piste
export const LARGEUR_PISTE = 5;
export const LONGUEUR_SURFACE_HORS_PISTE = 1000;
export const LARGEUR_SURFACE_HORS_PISTE = 1000;
export const WIDTH = 5000;
export const NOMBRE_SOMMETS_LARGEUR = 300;
export const NOMBRE_SOMMETS_LONGUEUR = 300;
export const POSITION_RELIEF_PAR_RAPPORT_Z = -5;

// Mathématique
export const PI_SUR_4 = 0.785398163;
export const ANGLE_45 = 'angle45';

// Voiture & Deplacements
export const EMPLACEMENT_VOITURE = '../../assets/modeles/lamborghini/lamborghini-aventador-pbribl.json';
export const REDUCTION_VITESSE = 10;
export const VITESSE_INTIALE = 0;
export const ROTATION = 0.03;
export const ACCELERATION = 0.01;
export const DECELERATION = 0.01;
export const VITESSE_MAX = 1;
export const VITESSE_MIN = 0.05;
export const VITESSE_MODE_ACCELERATEUR = 1.5;
export const DUREE_ACCELERATEUR = 1500;
export const NOMBRE_SECOUSSES_NID_DE_POULE = 4;
export const VOITURE_VECTEUR_AVANT_GAUCHE = 82;
export const VOITURE_VECTEUR_ARRIERE_GAUCHE = 4;
export const PERTE_VITESSE_COLLISION = 0.3;
export const MINIMUM_VITESSE_COLLISION = 0.3;

// Intelligence Artificielle
export const VITESSE_IA = 0.3;

// Emplacements
export const ARBRE_PATH = '../../assets/objects/arbre/tree.json';
export const ARBRE_TEXTURE = '../../assets/objects/arbre/tree.jpg';
export const SURFACE_HORS_PISTE_TEXTURE = '../../assets/textures/texturerock.jpg';
export const JOUR_TEXTURE = '../../assets/textures/day.jpeg';
export const NUIT_TEXTURE = '../../assets/textures/night.jpg';
export const EMPLACEMENT_MUSIQUE = './../assets/musiques/';
export const DAMIER_DEPART_TEXTURE = '../../assets/textures/ligne_depart.jpg';
export const ZONE_DEPART_TEXTURE = '../../assets/textures/asphalt.JPG';
export const LIGNE_DEPART_COULEUR = 0XFF0000;

// Temps
export const DUREE_STINGER_MILISECONDES = 3 * Math.pow(10, 3);
export const NOMBRE_ARRONDI_DECIMALE = 2;

// Parametres jeu
export const FPS = 60;
export const DELTA_ZOOM = .5;
export const NOMBRE_DE_TOURS_PARTIE_DEFAUT = 3;
export const NOMBRE_DE_TOURS_PARTIE_MINIMAL = 1;
export const TABLEAU_POSITION = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
export const POINTS_MAXIMUM = 1000;
export const DIFFERENCE_DISTANCE_PARCOURUE_RAISONNABLE = 100;
export const DISTANCE_RAISONNABLE_PRES_LIGNE_ARRIVEE = 100;
export const LARGEUR_RETROVISEUR = 300;
export const HAUTEUR_RETROVISEUR = 100;
export const NOMBRE_JOUEURS = 4;
export const OFFSET_VUE_DESSUS = 50;
export const CAMERA_OFFSET_X = -5;
export const CAMERA_OFFSET_Y = 2;
export const CAMERA_OFFSET_Z = 0;
export const VALEUR_MAX_ZOOM = 5;
export const VALEUR_MIN_ZOOM = 1;

// Touches
export const MODE_JOUR_NUIT = 'n';
export const MODE_FILTRE_COULEUR = 'f';
export const CHANGER_VUE = 'c';
export const ZOOM_AVANT = '+';
export const ZOOM_ARRIERE = '-';
export const ALLUMER_PHARES = 'l';
export const AVANCER = 'w';
export const GAUCHE = 'a';
export const DROITE = 'd';
export const RETROVISEUR = 'r';

// Noms
export const NOM_THEMATIQUE = 'Get The New World';
export const NOM_EDITEUR = 'Sims - Building Mode 3';
export const NOM_COURSE = 'The Legend of Zelda Ocarina of Time - Gerudo Valley';
export const NOM_STINGER = 'Zelda - Ocarina of Time - Treasure Chest 1';
export const NOM_ARBRE = 'Prunus_americana_01';
export const LUMIERE_AVANT_DROITE = 'Lumière Avant Droite';
export const LUMIERE_AVANT_GAUCHE = 'Lumière Avant Gauche';
export const PHARE_GAUCHE = 'Phare Gauche';
export const PHARE_DROITE = 'Phare Droit';
export const NOM_VOITURE = 'Voiture';
export const NOM_SKYBOX = 'Skybox';

// Lumieres
export const LUMIERES = [
    'AreaLight', 'AreaLight1', 'SpotLight', 'SpotLight1', 'HemisphereLight',
    'BrakeLightLS1', 'BrakeLightLS2', 'BrakeLightLS3', 'BrakeLightLS4',
    'BrakeLightRS1', 'BrakeLightRS2', 'BrakeLightRS3', 'BrakeLightRS4',
    'Lumière Avant Droite', 'Lumière Avant Gauche', 'Phare Droit', 'Phare Gauche'
];
export const PHARES = [
    'BrakeLightLS1', 'BrakeLightRS1', 'Lumière Avant Droite', 'Lumière Avant Gauche', 'Phare Droit', 'Phare Gauche'];

export const SCALAIRE = 30;
export const INTENSITE_LUMIERE_POINT = 0.5;
export const DISTANCE_LUMIERE_POINT = 5;
export const INTENSITE_LUMIERE_SPOT = 2;
export const ANGLE_LUMIERE_SPOT = 0.5;
export const DISTANCE_LUMIERE_SPOT = 80;
export const INTENSITEE = 1;
export const HEX = 0xffffff;
export const INTENSITE = 0.6;

export const HEMISPHERE_COULEUR = { h: 0.6, s: 0.75, l: 0.5 };
export const HEMISPHERE_COULEURTERRE = { h: 0.095, s: 0.5, l: 0.5 };
export const DIRECTION_COULEUR = { h: 0.1, s: 1, l: 0.95 };
export const LUMIERE_HEMISPHERE_POSITION = { x: 0, y: 500, z: 0 };
export const LUMIERE_DIRECITON_POSITION = { x: -1, y: 0.75, z: 1 };
export const LUMIERE_POINT_POSITION = { x: 2.7, y: 1, z: 0.6 };
export const LIMIERE_SPOT_POSITION = { x: 3, y: 1.5, z: 0.6 };
export const LIMIERE_SPOT_TARGET_POSITION = { x: 6, y: 0.5, z: 1 };

// Obstacles
export const CHEMIN_ACCES_ACCELERATEUR = '../../assets/textures/accelerateur.png';
export const NIVEAU_CLARETE = 4;
export const POSITION_OBSTACLE_EN_Z = 0.01;
export const HEX_BLEU = 0x0000ff;
export const HEX_NOIR = 0x000000;
export const RADIAN_FLAQUE_EAU = 2;
export const SEGMENTS_FLAQUE_EAU = 7;
export const MAXIMUM_OBSTACLES_PAR_TYPE = 5;
export const LARGEUR_ACCELERATEUR = 3;
export const LONGUEUR_ACCELERATEUR = 2;

// Divers
export const FORMAT_MP3 = '.mp3';
export const FORMAT_IMAGE = '.png';
export const DEBUT_STINGER = 8;
export const DUREE_STINGER = 12;
export const PREMIER_TOUR = 1;
export const DISTANCE_DE_LA_PISTE = 1;
export const Z_AU_DESSUS_DU_SEGMENT = 2;
export const ORIGINE = 0;
export const ORIENTATION_Z = -1;
export const ANISTROPY = 4;
export const REAJUSTEMENT_SKYBOX = 0.2;
export const DIMENSION_CUBE = 1500;
export const DISTANCE_POSITIONNEMENT_ORTHOGONALE = 3;
export const DISTANCE_POSITIONNEMENT_PARALLELE = 5;


// URL
export const URL_INSCRIPTION = 'http://localhost:3000/inscription';
export const URL_ADMINISTRATION = 'http://localhost:3000/admin';
export const URL_MOT_DE_PASSSE_OUBLIE = 'http://localhost:3000/motDePasseOublie';
export const URL_MODIFIER_MOT_DE_PASSE = 'http://localhost:3000/ModifierPass';
export const FIN_PARTIE_URL = 'http://localhost:3000/finPartie';
export const RESULTAT_PARTIE_URL = 'http://localhost:3000/resultatPartie';
export const CREATEUR_PISTE_URL = 'http://localhost:3000/createurPiste';
export const LISTE_PISTE_URL = 'http://localhost:3000/listePiste';
export const MESSAGE_ERREUR = 'Une erreur est arrivé';
// Couleurs
export const COMPOSANTE_R_POINT_EDITEUR = 0.55;
export const COMPOSANTE_G_POINT_EDITEUR = 0.91;
export const COMPOSANTE_B_POINT_EDITEUR = 0.64;
export const COULEUR_CIEL = 0xfd720f;
export const COULEUR_TERRE = 0xffffff;
export const COULEUR_PHARE = 0xffffff;
export const COULEUR_ROUGE = 'red';
export const COULEUR_FLAQUE_EAU = '#0000ff';
export const COULEUR_NID_DE_POULE = '#000000';
export const COULEUR_ACCELERATEUR = '#ffa500';

// Routage
export const LISTE_PISTE = '/listePiste';
export const INSCRIPTION = '/inscription';
export const ADMINISTRATION = '/admin';
export const MOT_DE_PASSE_OUBLIE = '/motDePasseOublie';
export const GENERATION_PISTE = '/generationpiste';
export const RESULTAT_PARTIE = '/resultatPartie';
export const FIN_PARTIE = '/finPartie';
export const ACCUEIL = '/';


export const LARGEUR_PISTE_EDITEUR = 10;
export const REPETITION_TEXTURE_ACCELERATEUR = 1;
export const REPETITION_TEXTURE_SURFACE_HORS_PISTE = 10;

export const NOMBRE_ARBRE_CREE = 10;
export const NOMS_OBJET_A_ENLEVER = ['Plane', 'Null'];

// liste Skybox
export const SKYBOX_JOUR = [
    '../../assets/textures/Skybox/interstellar/',
    '../../assets/textures/Skybox/sand/',
    '../../assets/textures/Skybox/storm/',
    '../../assets/textures/Skybox/sunset/'

];

export const SKYBOX_NUIT = [
    '../../assets/textures/Skybox/space/',
    '../../assets/textures/Skybox/moon/'];

export const ORIENTATIONS_SKYBOX = ['front', 'back', 'top', 'bottom', 'right', 'left'];
export const FACE_SKYBOX = 6;

export const NID_DE_POULE = 'nidDePoule';
export const FLAQUE = 'flaque';
export const ACCELERATEUR = 'accelerateur';
export const LUMIERE_DIRECTIONNELLE_NOM = 'lumiereDirectionnelle';
export const LUMIERE_HEMISPHERE_NOM = 'lumiereHemisphere';

export const IMAGE_PNG = 'image/png';


// SEGMENT MODEL
export const ANISOTROPY = 4;
export const REPETITION_TEXTURE_ZONE_DEPART = 10;
export const DIMENSION_CHECK_POINT = 1;



// parametre camera JEUX DE COURSE

export const FOV = 75;
export const PRES = 1;
export const LOIN = 6000;

// couleur voiture


export const COULEUR_VOITURE_JOUEUR = 'grey';
export const COULEUR_VOITURE_JOUEUR_VIRTUEL = 'black';
export const MILLE = 1000;
export const JOUEUR = 'Joueur';



export const COEFFICIENT_ACTUALISATION_DIRECTION = 0.999;
export const ANGLEROTATION = 0.01;
export const DISTANCE_MINIMALE_DETECTION_PROFESSIONNEL = 20;
export const DISTANCE_MINIMALE_DETECTION_AMATEUR = 35;
export const VITESSE_MAX_PROFESSIONNEL = 0.6;
export const VITESSE_MAX_AMATEUR = 0.4;
export const VITESSE_MIN_PROFESSIONNEL = 0.15;
export const VITESSE_MIN_AMATEUR = 0.25;
export const PAS_VARIATION_VITESSE_PROFESSIONNEL = 0.005;
export const PAS_VARIATION_VITESSE_AMATEUR = 0.0005;
export const FACTEUR_MULTIPLICATION_ROTATION_PROFESSIONNEL = 3;
export const FACTEUR_MULTIPLICATION_ROTATION_AMATEUR = 1;
export const PROFESSIONNNEL = 'Professionnel';
