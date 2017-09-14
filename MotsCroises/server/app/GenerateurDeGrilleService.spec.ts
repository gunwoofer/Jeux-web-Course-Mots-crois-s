import { assert } from 'chai';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { MotsCroises } from './MotsCroises';

describe('GenerateurDeGrilleService', () => {
     it('Une grille est carre et fait dix cases de cote.', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();     
        let motsCroises = generateurDeGrilleService.genererGrille();

        assert(motsCroises.obtenirHauteurCases() === 10);
        assert(motsCroises.obtenirLongueurCases() === 10);
     });

     it('Chaque ligne et colonne contient un ou deux mots ecrits de gauche a droite et de haut en bas.', () => {
        let generateurDeGrilleService = new GenerateurDeGrilleService();     
        let motsCroises = generateurDeGrilleService.genererGrille();

        for(let i:number = 0; i < 10; i++)
        {
            assert((motsCroises.obtenirNombreMotsSurLigne(i) === 1) || (motsCroises.obtenirNombreMotsSurLigne(i) === 2));
            assert((motsCroises.obtenirNombreMotsSurColonne(i) === 1) || (motsCroises.obtenirNombreMotsSurColonne(i) === 2));
        }
     });
});
