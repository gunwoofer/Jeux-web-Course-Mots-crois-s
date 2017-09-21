import { assert } from 'chai';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Grille, Niveau } from './Grille';
import { Case, EtatCase } from './Case';
import { Rarete } from './Mot';
import { DifficulteDefinition } from './Indice';
import { EmplacementMot } from './EmplacementMot';

describe('GenerateurDeGrilleService', () => {
    it('Une grille est carre et fait dix cases de cote.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        const grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        assert(grille.obtenirHauteurCases() === 10);
        assert(grille.obtenirLongueurCases() === 10);
    });

    it('Chaque ligne et colonne contient un ou deux mots ecrits de gauche a droite et de haut en bas.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        const grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        for (let i = 0; i < 10; i++) {
            assert((grille.obtenirNombreMotsSurLigne(i) === 1) || (grille.obtenirNombreMotsSurLigne(i) === 2));
            assert((grille.obtenirNombreMotsSurColonne(i) === 1) || (grille.obtenirNombreMotsSurColonne(i) === 2));
        }
    });

    it('Les emplacements mots sur chaque ligne ou chaque colonne sont différentes.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        const grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        let aTrouveDoublonSurMemeLigneOuMemeColonne = false;

        for (const emplacementMotAVerifier of grille.obtenirPositionsEmplacementsVides()) {
            aTrouveDoublonSurMemeLigneOuMemeColonne = !grille.emplacementMotDifferent(emplacementMotAVerifier);
        }
        assert(!aTrouveDoublonSurMemeLigneOuMemeColonne);
    });

    it('Le niveau de difficulté d une grille correspond au niveau de difficulte des paires mot:indice qui la composent', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        const grilleFacile = generateurDeGrilleService.genererGrille(Niveau.facile);
        const grilleMoyen = generateurDeGrilleService.genererGrille(Niveau.moyen);
        const grilleDifficile = generateurDeGrilleService.genererGrille(Niveau.difficile);

        for (let i = 0; i < grilleFacile.obtenirMot().length; i++) {
            assert(grilleFacile.obtenirMot()[i].obtenirRarete() === Rarete.commun);
            assert(grilleFacile.obtenirMot()[i].obtenirIndice().obtenirDifficulteDefinition() ===
                DifficulteDefinition.PremiereDefinition);


            assert(grilleMoyen.obtenirMot()[i].obtenirRarete() === Rarete.commun);
            assert(grilleMoyen.obtenirMot()[i].obtenirIndice().obtenirDifficulteDefinition() ===
                DifficulteDefinition.DefinitionAlternative);

            assert(grilleDifficile.obtenirMot()[i].obtenirRarete() === Rarete.nonCommun);
            assert(grilleDifficile.obtenirMot()[i].obtenirIndice().obtenirDifficulteDefinition() ===
                DifficulteDefinition.DefinitionAlternative);
        }
    });

    it('Une grille ne dois pas contenir deux fois le même mot.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        const grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        assert(!grille.contientMotDuplique());
    });

    it('Les accents, tremas et cedilles sont ignores.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        const grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        for (const ligneCasesCourante of grille.obtenirCases()) {
            for (const caseCourante of ligneCasesCourante) {
                if (caseCourante.etat === EtatCase.pleine) {
                    const lettreCourante: string = caseCourante.obtenirLettre();

                    assert(lettreCourante === lettreCourante);
                }
            }
        }
    });

    it('Les mots avec apostrophes et traits d\'union sont acceptes, mais ces signes sont ignores dans la representation du mot.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        const grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        for (const ligneCasesCourante of grille.obtenirCases()) {
            for (const caseCourante of ligneCasesCourante) {
                if (caseCourante.etat === EtatCase.pleine) {
                    const lettreCourante: string = caseCourante.obtenirLettre();


                    assert((lettreCourante !== '-') && (lettreCourante !== '\''));
                }
            }
        }
    });

    it('La grille est pleine: chaque case est soit pleine soit noire', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        const grille = generateurDeGrilleService.genererGrille(Niveau.facile);

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                assert((grille.obtenirCase(i, j).etat === EtatCase.noir) || (grille.obtenirCase(i, j).etat === EtatCase.pleine));
            }
        }
    });

    it('Chaque intersection a bien une lettre commune aux 2 mots qui se coupent', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        const grille = generateurDeGrilleService.genererGrille(Niveau.facile);
        const tableauCasesIntersection: Case[] = new Array();

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (grille.obtenirCase(i, j).intersection === true) {
                    tableauCasesIntersection.push(grille.obtenirCase(i, j));
                }
            }
        }
        for (let i = 0; i < tableauCasesIntersection.length; i++) {
            const tableau2EmplacementsCroises: EmplacementMot[] = new Array(2);
            const positionIntersectionDansEmplacement: number[] = new Array();
            for (const emplacements of grille.obtenirPositionsEmplacementsVides()) {
                for (let j = 0; j < emplacements.obtenirCases().length; j++) {
                    if (emplacements.obtenirCases()[j].comparerCase(tableauCasesIntersection[i])) {
                        tableau2EmplacementsCroises.push(emplacements);
                        positionIntersectionDansEmplacement.push(j);
                    }
                }
            }
            assert(tableau2EmplacementsCroises[0].obtenirCases()[positionIntersectionDansEmplacement[0]]
                .comparerCase(tableau2EmplacementsCroises[1].obtenirCases()[positionIntersectionDansEmplacement[1]]));
        }
    });

    it('Plusieurs grilles vides différentes doivent pouvoir être généré.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        const grille1: Grille = generateurDeGrilleService.genereGrilleVide(Niveau.facile);
        const grille2: Grille = generateurDeGrilleService.genereGrilleVide(Niveau.facile);
        let grilleDifferente = false;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const caseGrille1: Case = grille1.obtenirCase(i, j);
                const caseGrille2: Case = grille2.obtenirCase(i, j);
                if (caseGrille1.etat !== caseGrille2.etat) {
                    grilleDifferente = true;
                }
            }
        }

        assert(grilleDifferente);
    });
});
