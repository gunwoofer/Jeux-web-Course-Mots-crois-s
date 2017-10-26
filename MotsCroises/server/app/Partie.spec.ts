import { assert } from 'chai';
import { Joueur } from '../../commun/Joueur';
import { Grille } from './Grille';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { Niveau } from '../../commun/Niveau';
import { TypePartie } from '../../commun/TypePartie';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { Partie } from './Partie';

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

});
