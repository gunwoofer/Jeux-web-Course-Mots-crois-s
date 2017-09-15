import { assert } from 'chai';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Grille, Niveau } from './Grille';
import { Case, EtatCase } from './Case';
import { Rarete } from './Mot';
import { Indice, DifficulteDefinition } from './Indice';
import { EmplacementMot } from './EmplacementMot';

describe('GenerateurDeGrilleService', () => {
    it('Une grille est carre et fait dix cases de cote.', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();
        let grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        assert(grille.obtenirHauteurCases() === 10);
        assert(grille.obtenirLongueurCases() === 10);
    });

    it('Chaque ligne et colonne contient un ou deux mots ecrits de gauche a droite et de haut en bas.', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();
        let grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        for (let i: number = 0; i < 10; i++) {
            assert((grille.obtenirNombreMotsSurLigne(i) === 1) || (grille.obtenirNombreMotsSurLigne(i) === 2));
            assert((grille.obtenirNombreMotsSurColonne(i) === 1) || (grille.obtenirNombreMotsSurColonne(i) === 2));
        }
    });

    it('Le niveau de difficulté d une grille correspond au niveau de difficulte des paires mot:indice qui la composent', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();
        let grilleFacile = generateurDeGrilleService.genererGrille(Niveau.facile);
        let grilleMoyen = generateurDeGrilleService.genererGrille(Niveau.moyen);
        let grilleDifficile = generateurDeGrilleService.genererGrille(Niveau.difficile);

        for (let i: number = 0; i < grilleFacile.obtenirMot().length; i++) {
            assert(grilleFacile.obtenirMot()[i].obtenirRarete() == Rarete.commun);
            assert(grilleFacile.obtenirMot()[i].obtenirIndice().obtenirDifficulteDefinition() == DifficulteDefinition.PremiereDefinition);


            assert(grilleMoyen.obtenirMot()[i].obtenirRarete() == Rarete.commun);
            assert(grilleMoyen.obtenirMot()[i].obtenirIndice().obtenirDifficulteDefinition() == DifficulteDefinition.DefinitionAlternative);

            assert(grilleDifficile.obtenirMot()[i].obtenirRarete() == Rarete.nonCommun);
            assert(grilleDifficile.obtenirMot()[i].obtenirIndice().obtenirDifficulteDefinition() == DifficulteDefinition.DefinitionAlternative);

        }


    });

    it('Une grille ne dois pas contenir deux fois le même mot.', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();
        let grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        assert(!grille.contientMotDuplique());
    });

    it('Les accents, tremas et cedilles sont ignores.', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();
        let grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        for (let ligneCasesCourante of grille.obtenirCases()) {
            for (let caseCourante of ligneCasesCourante) {
                if (caseCourante.etat == EtatCase.pleine) {
                    let lettreCourante: string = caseCourante.obtenirLettre();
                    let lettreCouranteSimplife: string = lettreCourante.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

                    assert(lettreCourante === lettreCourante);
                }
            }
        }
    });

    it('Les mots avec apostrophes et traits d\'union sont acceptes, mais ces signes sont ignores dans la representation du mot.', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();
        let grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        for (let ligneCasesCourante of grille.obtenirCases()) {
            for (let caseCourante of ligneCasesCourante) {
                if (caseCourante.etat == EtatCase.pleine) {
                    let lettreCourante: string = caseCourante.obtenirLettre();


                    assert((lettreCourante != "-") && (lettreCourante !== "'"));
                }
            }
        }
    });

    it('La grille est pleine: chaque case est soit pleine soit noire', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();
        let grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                assert((grille.obtenirCase(i, j).etat === EtatCase.noir) || (grille.obtenirCase(i, j).etat === EtatCase.pleine));
            }
        }
    });

    it('Chaque intersection a bien une lettre commune aux 2 mots qui se coupent', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();
        let grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        let tableauCasesIntersection: Case[];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (grille.obtenirCase(i, j).obtenirEtatIntersection() === true) {
                    tableauCasesIntersection.push(grille.obtenirCase(i, j));
                }
            }
        }
        for (let i = 0; i < tableauCasesIntersection.length; i++) {
            let tableau2EmplacementsCroises: EmplacementMot[] = new Array(2);
            let positionIntersectionDansEmplacement : number [];
            for (let emplacements of grille.obtenirPositionsEmplacementsVides()) {
                for (let j = 0; j < emplacements.obtenirCases().length; j++) {
                    if (emplacements.obtenirCases()[j].comparerCase(tableauCasesIntersection[i])) {
                        tableau2EmplacementsCroises.push(emplacements);
                        positionIntersectionDansEmplacement.push(j);
                    }
                }
            }
                 assert (tableau2EmplacementsCroises[0].obtenirCases()[positionIntersectionDansEmplacement[0]]
                .comparerCase(tableau2EmplacementsCroises[1].obtenirCases()[positionIntersectionDansEmplacement[1]]));
        }
    });

});
