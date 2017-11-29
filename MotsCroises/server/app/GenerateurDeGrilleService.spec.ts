import { assert } from 'chai';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Grille } from './Grille';
import { Case, EtatCase } from '../../commun/Case';
import { Niveau } from '../../commun/Niveau';
import { GenerateurDeGrilleVide } from './GenerateurDeGrilleVide';

describe('GenerateurDeGrilleService', () => {
    const generateurDeGrilleService = new GenerateurDeGrilleService();
    let grille: Grille;

    before(function () {
        console.log('Generation de la grille en cours...');
        grille = generateurDeGrilleService.genererGrilleMotSync(Niveau.facile);
        // Generation de la grille en moins de 30 secondes
        this.timeout(30000);
    });

    it('Chaque ligne et colonne contient un ou deux mots ecrits de gauche a droite et de haut en bas.', () => {
        for (let i = 0; i < 10; i++) {
            assert((grille.obtenirNombreMotsSurLigne(i) === 1) || (grille.obtenirNombreMotsSurLigne(i) === 2));
            assert((grille.obtenirNombreMotsSurColonne(i) === 1) || (grille.obtenirNombreMotsSurColonne(i) === 2));
        }
    });

    it('Une grille ne dois pas contenir deux fois le même mot.', () => {
        assert(!grille.motsComplet.contientMotDuplique());
    });

    /*
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
    });*/
});

