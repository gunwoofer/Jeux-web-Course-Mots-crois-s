import { assert } from 'chai';
import { Joueur } from '../../commun/Joueur';
import { Grille } from './Grille';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { Niveau } from '../../commun/Niveau';
import { TypePartie } from '../../commun/TypePartie';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { Partie } from './Partie';

const DELAI_MAXIMUM_MILISECONDES = 5 * Math.pow(10, 3);

describe('Partie', () => {
    it('Le serveur conserve les mots sélectionnés des joueurs.', () => {
        const generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();

        const joueur1: Joueur = new Joueur();
        const joueur2: Joueur = new Joueur();
        const grille: Grille = generateurDeGrilleService.genererGrilleMock(Niveau.facile);

        let emplacementMotSelectionnerParJoueur1: EmplacementMot = grille.emplacementMots[0];
        let emplacementMotSelectionnerParJoueur2: EmplacementMot = grille.emplacementMots[1];


        const guidPartie: string = gestionnaireDePartieService.creerPartie(joueur1, TypePartie.classique, grille, Niveau.facile, joueur2);
        const partieEnCours: Partie = gestionnaireDePartieService.obtenirPartieEnCours(guidPartie);

        partieEnCours.changerSelectionMot(joueur1.obtenirGuid(), emplacementMotSelectionnerParJoueur1);
        partieEnCours.changerSelectionMot(joueur2.obtenirGuid(), emplacementMotSelectionnerParJoueur2);

        assert(emplacementMotSelectionnerParJoueur1.estPareilQue(
            partieEnCours.obtenirEmplacementMotSelectionnerJoueur(joueur1.obtenirGuid())));

        assert(emplacementMotSelectionnerParJoueur2.estPareilQue(
            partieEnCours.obtenirEmplacementMotSelectionnerJoueur(joueur2.obtenirGuid())));

        emplacementMotSelectionnerParJoueur1 = grille.emplacementMots[2];
        emplacementMotSelectionnerParJoueur2 = grille.emplacementMots[2];

        // Changer l'emplacement mot des deux joueurs.
        partieEnCours.changerSelectionMot(joueur1.obtenirGuid(), emplacementMotSelectionnerParJoueur1);
        partieEnCours.changerSelectionMot(joueur2.obtenirGuid(), emplacementMotSelectionnerParJoueur2);

        assert(emplacementMotSelectionnerParJoueur1.estPareilQue(
            partieEnCours.obtenirEmplacementMotSelectionnerJoueur(joueur1.obtenirGuid())));

        assert(emplacementMotSelectionnerParJoueur2.estPareilQue(
            partieEnCours.obtenirEmplacementMotSelectionnerJoueur(joueur2.obtenirGuid())));

        assert(grille.emplacementMots[2].estSelectionnerNombreDeJoueurs() === 2);
    });

    it('Le serveur conserve un compteur pour les joueurs.', (done) => {
        const generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();

        const joueur1: Joueur = new Joueur();
        const joueur2: Joueur = new Joueur();
        const grille: Grille = generateurDeGrilleService.genererGrilleMock(Niveau.facile);


        const guidPartie: string = gestionnaireDePartieService.creerPartie(joueur1, TypePartie.classique, grille, Niveau.facile, joueur2);
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
        const generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();

        const joueur1: Joueur = new Joueur();
        const joueur2: Joueur = new Joueur();
        const grille: Grille = generateurDeGrilleService.genererGrilleMock(Niveau.facile);
        const tempsAlloueMilisecondes: number = 1 * Math.pow(10, 3);


        const guidPartie: string = gestionnaireDePartieService.creerPartie(joueur1, TypePartie.classique, grille, Niveau.facile, joueur2);
        const partieEnCours: Partie = gestionnaireDePartieService.obtenirPartieEnCours(guidPartie);
        partieEnCours.demarrerPartie(tempsAlloueMilisecondes);

        setTimeout((partie: Partie) => {

            assert(partie.partieEstTermineAvecCompteur());
            done();

        }, tempsAlloueMilisecondes, partieEnCours);

    }).timeout(DELAI_MAXIMUM_MILISECONDES);

    it('Le serveur indique que la partie n\'est pas terminé quand le compteur n\'est pas échoué.', (done) => {
        const generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();

        const joueur1: Joueur = new Joueur();
        const joueur2: Joueur = new Joueur();
        const grille: Grille = generateurDeGrilleService.genererGrilleMock(Niveau.facile);
        const tempsAlloueMilisecondes: number = 1 * Math.pow(10, 3);


        const guidPartie: string = gestionnaireDePartieService.creerPartie(joueur1, TypePartie.classique, grille, Niveau.facile, joueur2);
        const partieEnCours: Partie = gestionnaireDePartieService.obtenirPartieEnCours(guidPartie);
        partieEnCours.demarrerPartie(tempsAlloueMilisecondes);

        setTimeout((partie: Partie) => {

            assert(!partie.partieEstTermineAvecCompteur());
            done();

        }, tempsAlloueMilisecondes - 500, partieEnCours);

    }).timeout(DELAI_MAXIMUM_MILISECONDES);
});
