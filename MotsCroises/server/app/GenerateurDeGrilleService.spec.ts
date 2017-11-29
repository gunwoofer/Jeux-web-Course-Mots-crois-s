import { assert } from 'chai';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Grille } from './Grille';
import { Case, EtatCase } from '../../commun/Case';
import { Niveau } from '../../commun/Niveau';
import { GenerateurDeGrilleVide } from './GenerateurDeGrilleVide';

describe('GenerateurDeGrilleVide', () => {
    it('Une grille est carre et fait dix cases de cote.', () => {
        const generateurDeGrilleVide = new GenerateurDeGrilleVide();
        const grille = generateurDeGrilleVide.genereGrilleVide(Niveau.facile);
        assert(grille.cases.obtenirHauteurCases() === 10);
        assert(grille.cases.obtenirLongueurCases() === 10);

    });
    /*
    it('Chaque ligne et colonne contient un ou deux mots ecrits de gauche a droite et de haut en bas.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        generateurDeGrilleService.genererGrille(Niveau.facile).then((grille) => {
            for (let i = 0; i < 10; i++) {
                assert((grille.obtenirNombreMotsSurLigne(i) === 1) || (grille.obtenirNombreMotsSurLigne(i) === 2));
                assert((grille.obtenirNombreMotsSurColonne(i) === 1) || (grille.obtenirNombreMotsSurColonne(i) === 2));
            }
        });
    });

    it('Une grille ne dois pas contenir deux fois le même mot.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        generateurDeGrilleService.genererGrille(Niveau.facile).then((grille) => {
            assert(!grille.motsComplet.contientMotDuplique());
        });
    });

    it('Une grille ne contient pas d\'emplacements de mot qui se chevauchent sur la même colonne ou sur la même ligne.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        generateurDeGrilleService.genererGrille(Niveau.facile).then((grille) => {
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
    });

    it('Les accents, tremas et cedilles sont ignores.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        generateurDeGrilleService.genererGrille(Niveau.facile).then((grille) => {
            for (const ligneCasesCourante of grille.cases.obtenirCases()) {
                for (const caseCourante of ligneCasesCourante) {
                    if (caseCourante.etat === EtatCase.pleine) {
                        const lettreCourante: string = caseCourante.obtenirLettre();
                        assert(lettreCourante === lettreCourante);
                    }
                }
            }
        });
    });

    it('Les mots avec apostrophes et traits d\'union sont acceptes, mais ces signes sont ignores dans la representation du mot.', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        generateurDeGrilleService.genererGrille(Niveau.facile).then((grille) => {
            for (const ligneCasesCourante of grille.cases.obtenirCases()) {
                for (const caseCourante of ligneCasesCourante) {
                    if (caseCourante.etat === EtatCase.pleine) {
                        const lettreCourante: string = caseCourante.obtenirLettre();
                        assert((lettreCourante !== '-') && (lettreCourante !== '\''));
                    }
                }
            }
        });
    });

    it('La grille est pleine: chaque case est soit pleine soit noire', () => {
        const generateurDeGrilleService = new GenerateurDeGrilleService();
        generateurDeGrilleService.genererGrille(Niveau.facile).then((grille) => {
            for (let i = 0; i < 10; i++) {
                for (let j = 0; j < 10; j++) {
                    assert((grille.cases.obtenirCase(i, j).etat === EtatCase.noir) ||
                        (grille.cases.obtenirCase(i, j).etat === EtatCase.pleine));
                }
            }
        });
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
    });*/
});
