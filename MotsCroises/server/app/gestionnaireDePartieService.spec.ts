import { assert } from 'chai';
import { Joueur } from '../../commun/Joueur';
import { Case } from '../../commun/Case';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { Grille } from './grille';
import { GestionnaireDePartieService } from './gestionnaireDePartieService';
import { Niveau } from '../../commun/Niveau';
import { TypePartie } from '../../commun/TypePartie';
import { GenerateurDeGrilleService } from './generateurDeGrilleService';
import { RequisPourMotAVerifier } from '../../commun/requis/RequisPourMotAVerifier';

const maxDelaiRetourRequeteMS = 10000;
const maxDelaiGenerationGrille = 35000;

describe('GestionnaireDePartieService', () => {
    const generateurDeGrilleService = new GenerateurDeGrilleService();
    let grilleDepart: Grille;

    before(function () {
        console.log('Generation de la grille en cours...');
        grilleDepart = generateurDeGrilleService.genererGrilleMotSync(Niveau.facile);
        this.timeout(maxDelaiGenerationGrille);
    });

    it('Il est possible de créer une partie classique pour un joueur.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.classique_a_un;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);

        assert(gestionniareDePartieService.obtenirPartieEnCours(guidPartie) !== undefined);
        done();
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible de créer une partie dynamique pour un joueur.', (done) => {
        const joueur: Joueur = new Joueur();
        const typePartie: TypePartie = TypePartie.dynamique_a_un;
        const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
        let guidPartie = '';
        guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
        assert(gestionniareDePartieService.obtenirPartieEnCours(guidPartie) !== undefined);
        done();
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
        done();
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
        done();
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
        done();
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
