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
            assert(grilleFacile.obtenirMotParticulier(i).obtenirRarete() === Rarete.commun);
            assert(grilleFacile.obtenirMotParticulier(i).obtenirIndice().obtenirDifficulteDefinition() ===
                DifficulteDefinition.PremiereDefinition);


            assert(grilleMoyen.obtenirMotParticulier(i).obtenirRarete() === Rarete.commun);
            assert(grilleMoyen.obtenirMotParticulier(i).obtenirIndice().obtenirDifficulteDefinition() ===
                DifficulteDefinition.DefinitionAlternative);

            assert(grilleDifficile.obtenirMotParticulier(i).obtenirRarete() === Rarete.nonCommun);
            assert(grilleDifficile.obtenirMotParticulier(i).obtenirIndice().obtenirDifficulteDefinition() ===
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
