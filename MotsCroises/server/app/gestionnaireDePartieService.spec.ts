import { assert } from 'chai';
import { Joueur } from '../../commun/Joueur';
import { Case } from '../../commun/Case';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { Grille } from './grille';
import { GestionnaireDePartieService } from './gestionnaireDePartieService';
import { Niveau } from '../../commun/Niveau';
import { TypePartie } from '../../commun/TypePartie';
import { SpecificationPartie } from '../../commun/SpecificationPartie';
import { DescripteurEvenementTempsReel } from './descripteurEvenementTempsReel';
import { GenerateurDeGrilleService } from './generateurDeGrilleService';
import { RequisPourMotAVerifier } from '../../commun/requis/RequisPourMotAVerifier';

export const maxDelaiRetourRequeteMS = 10000;

describe('GestionnaireDePartieService', () => {
    const generateurDeGrilleService = new GenerateurDeGrilleService();
    let grilleDepart: Grille;

    before(function () {
        console.log('Generation de la grille en cours...');
        grilleDepart = generateurDeGrilleService.genererGrilleMotSync(Niveau.facile);
        // Generation de la grille en moins de 30 secondes
        this.timeout(30000);
    });

    it('Il est possible de créer une partie classique pour un joueur.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.classique_a_un;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);

        assert(gestionniareDePartieService.obtenirPartieEnCours(guidPartie) !== undefined);
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible de créer une partie classique multijoueur est qu\'elle soit en attente.', () => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.classique_a_deux;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        const specificationPartie: SpecificationPartie = new SpecificationPartie(Niveau.facile, joueur, typePartie);
        const descripteurEvenementTempsReel: DescripteurEvenementTempsReel = new DescripteurEvenementTempsReel();
        descripteurEvenementTempsReel.preparerNouvellePartie(gestionniareDePartieService, generateurDeGrilleService, specificationPartie);

        assert(gestionniareDePartieService.obtenirPartieEnCours(specificationPartie.guidPartie)
            .obtenirPartieGuid() === specificationPartie.guidPartie);
        assert(!gestionniareDePartieService.obtenirPartieEnCours(specificationPartie.guidPartie).estDebute());
    });

    it('Il est possible de créer une partie dynamique pour un joueur.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        assert(gestionniareDePartieService.obtenirPartieEnCours(guidPartie) !== undefined);
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible de vérifier un mauvais mot dans la grille.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        const emplacementsMot: EmplacementMot[] = grilleDepart.emplacementsMots.emplacementsHorizontaux();
        const emplacementMot: EmplacementMot = emplacementsMot[0];
        const longueurMot: number = emplacementMot.obtenirGrandeur();
        let motAVerifier: string;

        for (let i = 0; i < longueurMot; i++) {
            motAVerifier += 'a';
        }
        const requisMotVerifier = new RequisPourMotAVerifier(emplacementMot, motAVerifier, joueur.obtenirGuid(), guidPartie);
        assert(!gestionniareDePartieService.estLeMot(requisMotVerifier));
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible de vérifier un bon mot dans la grille.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        const emplacementsMot: EmplacementMot[] = grilleDepart.obtenirEmplacementsMot();
        const emplacementMot: EmplacementMot = emplacementsMot[0];
        let motAVerifier = '';
        const casesEmplacementMot: Case[] = grilleDepart.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
            emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());
        for (const caseCourante of casesEmplacementMot) {
            motAVerifier += caseCourante.obtenirLettre();
        }
        const requisMotVerifier = new RequisPourMotAVerifier(emplacementMot, motAVerifier, joueur.obtenirGuid(), guidPartie);
        assert(gestionniareDePartieService.estLeMot(requisMotVerifier));
    }).timeout(maxDelaiRetourRequeteMS);

    it('Un mot ne peut pas être trouvé deux fois.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        const emplacementsMot: EmplacementMot[] = grilleDepart.obtenirEmplacementsMot();
        const emplacementMot: EmplacementMot = emplacementsMot[0];
        let motAVerifier = '';
        const casesEmplacementMot: Case[] = grilleDepart.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
            emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());
        for (const caseCourante of casesEmplacementMot) {
            motAVerifier += caseCourante.obtenirLettre();
        }
        const requisMotVerifier = new RequisPourMotAVerifier(emplacementMot, motAVerifier, joueur.obtenirGuid(), guidPartie);
        assert(!gestionniareDePartieService.estLeMot(requisMotVerifier));
    }).timeout(maxDelaiRetourRequeteMS);



    it('Une partie solo en cours n\'est pas terminé avant que le pointage n\'égale pas le nombre de mots à trouver.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        const emplacementsMot: EmplacementMot[] = grilleDepart.obtenirEmplacementsMot();
        let casesEmplacementMot: Case[];
        let emplacementMot: EmplacementMot;
        let caseDebut: Case;
        let caseFin: Case;
        let longueurMot: number;
        let motAVerifier = '';
        // Le « -1 » est pour qu'il ne manque qu'un mot à trouver.
        for (let i = 0; i < (emplacementsMot.length - 1); i++) {
            motAVerifier = '';
            emplacementMot = emplacementsMot[i];
            caseDebut = emplacementMot.obtenirCaseDebut();
            caseFin = emplacementMot.obtenirCaseFin();
            longueurMot = emplacementMot.obtenirGrandeur();
            casesEmplacementMot = grilleDepart.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
                emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());

            for (const caseCourante of casesEmplacementMot) {
                motAVerifier += caseCourante.obtenirLettre();
            }
            const requisMotVerifier = new RequisPourMotAVerifier(emplacementMot, motAVerifier, joueur.obtenirGuid(), guidPartie);
            assert(gestionniareDePartieService.estLeMot(requisMotVerifier));

        }
        assert(!gestionniareDePartieService.voirSiPartieTermine(guidPartie));
    }).timeout(maxDelaiRetourRequeteMS);

    it('Une partie solo en cours se termine lorsque tous les mots sont trouvés.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.classique_a_un;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        const emplacementsMot: EmplacementMot[] = grilleDepart.obtenirEmplacementsMot();
        let casesEmplacementMot: Case[];
        let emplacementMot: EmplacementMot;
        let caseDebut: Case;
        let caseFin: Case;
        let longueurMot: number;
        let motAVerifier = '';
        for (let i = 0; i < (emplacementsMot.length); i++) {
            motAVerifier = '';
            emplacementMot = emplacementsMot[i];
            caseDebut = emplacementMot.obtenirCaseDebut();
            caseFin = emplacementMot.obtenirCaseFin();
            longueurMot = emplacementMot.obtenirGrandeur();
            casesEmplacementMot = grilleDepart.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
                emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());
            for (const caseCourante of casesEmplacementMot) {
                motAVerifier += caseCourante.obtenirLettre();
            }
            const requisMotVerifier = new RequisPourMotAVerifier(emplacementMot, motAVerifier, joueur.obtenirGuid(), guidPartie);
            assert(gestionniareDePartieService.estLeMot(requisMotVerifier));
        }
        assert(gestionniareDePartieService.voirSiPartieTermine(guidPartie));
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible d\'obtenir les parties en cours', () => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        gestionniareDePartieService.obtenirPartieEnCours(guidPartie).demarrerPartie();
        assert(gestionniareDePartieService.obtenirPartiesEnAttente().length === 2);
    });
});
