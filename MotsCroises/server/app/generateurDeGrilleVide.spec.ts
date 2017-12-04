import { Case } from '../../commun/case';
import { assert } from 'chai';
import { Grille } from './grille';
import { GenerateurDeGrilleVide } from './generateurDeGrilleVide';
import { Niveau } from '../../commun/niveau';

describe('GenerateurDeGrilleVide', () => {
    it('Une grille est carre et fait dix cases de cote.', () => {
        const generateurDeGrilleVide = new GenerateurDeGrilleVide();
        const grille: Grille = generateurDeGrilleVide.genereGrilleVide(Niveau.facile);
        assert(grille.cases.obtenirHauteurCases() === 10);
        assert(grille.cases.obtenirLongueurCases() === 10);
    });

    it('Une grille ne contient pas d\'emplacements de mot qui se chevauchent sur la même colonne ou sur la même ligne.', () => {
        const generateurDeGrilleVide = new GenerateurDeGrilleVide();
        const grille: Grille = generateurDeGrilleVide.genereGrilleVide(Niveau.facile);
        let compteur = 0;
        for (const emplacementAEvaluer of grille.obtenirEmplacementsMot()) {
            compteur = 0;
            for (const emplacementCourant of grille.obtenirEmplacementsMot()) {
                if ((emplacementAEvaluer.obtenirCaseDebut() === emplacementCourant.obtenirCaseDebut()) &&
                    (emplacementAEvaluer.obtenirCaseFin() === emplacementCourant.obtenirCaseFin())) {
                    compteur++;
                    if (compteur > 1) {
                        assert(false);
                    }
                }
            }
        }
        assert(true);
    });

    it('Plusieurs grilles vides différentes doivent pouvoir être généré.', () => {
        const generateurDeGrilleVide = new GenerateurDeGrilleVide();
        const grille1: Grille = generateurDeGrilleVide.genereGrilleVide(Niveau.facile);
        const grille2: Grille = generateurDeGrilleVide.genereGrilleVide(Niveau.facile);
        let grilleDifferente = false;

        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                const caseGrille1: Case = grille1.cases.obtenirCase(i, j);
                const caseGrille2: Case = grille2.cases.obtenirCase(i, j);
                if (caseGrille1.etat !== caseGrille2.etat) {
                    grilleDifferente = true;
                }
            }
        }

        assert(grilleDifferente);
    });
});
