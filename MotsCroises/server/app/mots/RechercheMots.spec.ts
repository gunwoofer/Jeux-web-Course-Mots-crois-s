import { assert } from 'chai';
import { RechercheMots } from './RechercheMots';

describe('RechercheMots', () => {

    it('On peut trouver une liste de mots avec la liste de mots anglais.', () => {
        assert( RechercheMots.testRechercheMots().length > 0);
    });

    it('On peut trouver une liste de mots selon certains critères.', () => {
        assert( RechercheMots.rechercheMots(/[^a-z]a[a-z]{4}\n/g).length > 0);
    });
    
    it('On peut trouver une mot aléatoire selon certains critères.', () => {
        assert( RechercheMots.rechercherMot(/[^a-z]a[a-z]{4}\n/g).length !== 0);
    });
});
