import { assert } from 'chai';
import { Grille } from './Grille';
import { GenerateurDeGrilleVide } from './GenerateurDeGrilleVide';
import { Niveau } from '../../commun/Niveau';

describe('GenerateurDeGrilleVide', () => {
    it('Une grille est carre et fait dix cases de cote.', () => {
        const generateurDeGrilleVide = new GenerateurDeGrilleVide();
        const grille: Grille = generateurDeGrilleVide.genereGrilleVide(Niveau.facile);
        assert(grille.cases.obtenirHauteurCases() === 10);
        assert(grille.cases.obtenirLongueurCases() === 10);
    });
});
