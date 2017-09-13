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
});
