import { RequisPourMotAVerifier } from './../../commun/requis/RequisPourMotAVerifier';
import { assert } from 'chai';
import { Joueur } from '../../commun/Joueur';
import { Grille } from './grille';
import { GestionnaireDePartieService } from './gestionnaireDePartieService';
import { Niveau } from '../../commun/Niveau';
import { TypePartie } from '../../commun/TypePartie';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { Partie } from './partie';
import { Case } from '../../commun/Case';
import { GenerateurDeGrilleService } from './generateurDeGrilleService';

const DELAI_MAXIMUM_MILISECONDES = 5 * Math.pow(10, 3);
const maxDelaiGenerationGrille = 60000;

describe('Partie', () => {
    const generateurDeGrilleService = new GenerateurDeGrilleService();
    let grille: Grille;

    before(function () {
        console.log('Generation de la grille en cours...');
        grille = generateurDeGrilleService.genererGrilleMotSync(Niveau.facile);
        this.timeout(maxDelaiGenerationGrille);
    });

    it('Le serveur conserve les mots sélectionnés des joueurs.', () => {
        const gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        const joueur1: Joueur = new Joueur();
        const joueur2: Joueur = new Joueur();

        let emplacementMotSelectionnerParJoueur1: EmplacementMot = grille.emplacementsMots.emplacementMots[0];
        let emplacementMotSelectionnerParJoueur2: EmplacementMot = grille.emplacementsMots.emplacementMots[1];

        const guidPartie: string = gestionnaireDePartieService.creerPartie(joueur1, TypePartie.classique_a_deux,
            grille, Niveau.facile, joueur2);
        const partieEnCours: Partie = gestionnaireDePartieService.obtenirPartieEnCours(guidPartie);

        partieEnCours.changerSelectionMot(joueur1.obtenirGuid(), emplacementMotSelectionnerParJoueur1);
        partieEnCours.changerSelectionMot(joueur2.obtenirGuid(), emplacementMotSelectionnerParJoueur2);

        assert(emplacementMotSelectionnerParJoueur1.estPareilQue(
            partieEnCours.obtenirEmplacementMotSelectionnerJoueur(joueur1.obtenirGuid())));

        assert(emplacementMotSelectionnerParJoueur2.estPareilQue(
            partieEnCours.obtenirEmplacementMotSelectionnerJoueur(joueur2.obtenirGuid())));

        emplacementMotSelectionnerParJoueur1 = grille.emplacementsMots.emplacementMots[2];
        emplacementMotSelectionnerParJoueur2 = grille.emplacementsMots.emplacementMots[2];

        partieEnCours.changerSelectionMot(joueur1.obtenirGuid(), emplacementMotSelectionnerParJoueur1);
        partieEnCours.changerSelectionMot(joueur2.obtenirGuid(), emplacementMotSelectionnerParJoueur2);

        assert(emplacementMotSelectionnerParJoueur1.estPareilQue(
            partieEnCours.obtenirEmplacementMotSelectionnerJoueur(joueur1.obtenirGuid())));

        assert(emplacementMotSelectionnerParJoueur2.estPareilQue(
            partieEnCours.obtenirEmplacementMotSelectionnerJoueur(joueur2.obtenirGuid())));

        assert(grille.emplacementsMots.emplacementMots[2].estSelectionnerNombreDeJoueurs() === 2);
    });

    it('Le serveur conserve un compteur pour les joueurs.', (done) => {
        const gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();

        const joueur1: Joueur = new Joueur();
        const joueur2: Joueur = new Joueur();

        const guidPartie: string = gestionnaireDePartieService.creerPartie(joueur1, TypePartie.classique_a_deux,
            grille, Niveau.facile, joueur2);
        const partieEnCours: Partie = gestionnaireDePartieService.obtenirPartieEnCours(guidPartie);
        partieEnCours.demarrerPartie();

        const tempsPartieMilisecondes1: number = partieEnCours.obtenirTempsRestantMilisecondes();
        setTimeout((premiertemps: number) => {
            const tempsPartieMilisecondes2: number = partieEnCours.obtenirTempsRestantMilisecondes();
            assert((tempsPartieMilisecondes2 - tempsPartieMilisecondes1) > 0);
            done();

        }, 1 * Math.pow(10, 3), tempsPartieMilisecondes1);

    }).timeout(DELAI_MAXIMUM_MILISECONDES);

    it('Le serveur indique que la partie est terminé quand le compteur est échoué.', (done) => {
        const gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();

        const joueur1: Joueur = new Joueur();
        const joueur2: Joueur = new Joueur();
        const tempsAlloueMilisecondes: number = 1 * Math.pow(10, 3);

        const guidPartie: string = gestionnaireDePartieService.creerPartie(joueur1, TypePartie.classique_a_deux,
            grille, Niveau.facile, joueur2);
        const partieEnCours: Partie = gestionnaireDePartieService.obtenirPartieEnCours(guidPartie);
        partieEnCours.demarrerPartie(tempsAlloueMilisecondes);

        setTimeout((partie: Partie) => {

            assert(partie.partieEstTermineAvecCompteur());
            done();

        }, tempsAlloueMilisecondes, partieEnCours);

    }).timeout(DELAI_MAXIMUM_MILISECONDES);

    it('Le serveur indique que la partie n\'est pas terminé quand le compteur n\'est pas échoué.', (done) => {
        const gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();

        const joueur1: Joueur = new Joueur();
        const joueur2: Joueur = new Joueur();
        const tempsAlloueMilisecondes: number = 1 * Math.pow(10, 3);


        const guidPartie: string = gestionnaireDePartieService.creerPartie(joueur1, TypePartie.classique_a_deux, grille,
            Niveau.facile, joueur2);
        const partieEnCours: Partie = gestionnaireDePartieService.obtenirPartieEnCours(guidPartie);
        partieEnCours.demarrerPartie(tempsAlloueMilisecondes);

        setTimeout((partie: Partie) => {

            assert(!partie.partieEstTermineAvecCompteur());
            done();

        }, tempsAlloueMilisecondes - 500, partieEnCours);

    }).timeout(DELAI_MAXIMUM_MILISECONDES);

    it('Il est possible d\'obtenir une liste des mots trouvés par chaque joueur.', () => {
        const gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();

        const joueur1: Joueur = new Joueur();
        const joueur2: Joueur = new Joueur();

        const emplacementMotTrouveJoueur1: EmplacementMot = grille.emplacementsMots.emplacementMots[0];
        const emplacementMotTrouveJoueur2: EmplacementMot = grille.emplacementsMots.emplacementMots[1];

        let motAVerifierJoueur1 = '';
        let motAVerifierJoueur2 = '';
        let casesEmplacementMot: Case[];
        const guidPartie: string = gestionnaireDePartieService.creerPartie(joueur1, TypePartie.classique_a_deux, grille,
            Niveau.facile, joueur2);
        const partieEnCours: Partie = gestionnaireDePartieService.obtenirPartieEnCours(guidPartie);
        partieEnCours.demarrerPartie();

        // Trouve mot emplacement 1, joueur 1
        casesEmplacementMot = grille.obtenirCasesSelonCaseDebut(emplacementMotTrouveJoueur1.obtenirCaseDebut(),
        emplacementMotTrouveJoueur1.obtenirPosition(), emplacementMotTrouveJoueur1.obtenirGrandeur());

        for (const caseCourante of casesEmplacementMot) {
            motAVerifierJoueur1 += caseCourante.obtenirLettre();
        }

        const requisMotVerifier1 = new RequisPourMotAVerifier(emplacementMotTrouveJoueur1,
                                                            motAVerifierJoueur1,
                                                            joueur1.obtenirGuid(),
                                                            guidPartie);
        partieEnCours.estLeMot(requisMotVerifier1);

        // Trouve mot emplacement 2, joueur 2
        casesEmplacementMot = grille.obtenirCasesSelonCaseDebut(emplacementMotTrouveJoueur2.obtenirCaseDebut(),
        emplacementMotTrouveJoueur2.obtenirPosition(), emplacementMotTrouveJoueur2.obtenirGrandeur());

        for (const caseCourante of casesEmplacementMot) {
            motAVerifierJoueur2 += caseCourante.obtenirLettre();
        }

        const requisMotVerifier2 = new RequisPourMotAVerifier(emplacementMotTrouveJoueur2,
                                                            motAVerifierJoueur2,
                                                            joueur2.obtenirGuid(),
                                                            guidPartie);
        partieEnCours.estLeMot(requisMotVerifier2);

        const listeMotsTrouve: Object = partieEnCours.obtenirMotsTrouve();
        assert(listeMotsTrouve[joueur1.obtenirGuid()][0] === motAVerifierJoueur1);
        assert(listeMotsTrouve[joueur2.obtenirGuid()][0] === motAVerifierJoueur2);

    });
});
