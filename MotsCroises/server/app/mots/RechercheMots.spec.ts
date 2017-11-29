import { assert } from 'chai';
import { RechercheMots } from './RechercheMots';
import { Contrainte } from '../Contrainte';

describe('RechercheMots', () => {

    it('On peut trouver une liste de mots avec la liste de mots anglais.', () => {
        assert( RechercheMots.testRechercheMots().length > 0);
    });

    it('On peut trouver une liste de mots selon certains critères.', () => {
        assert( RechercheMots.rechercheMots(/[^a-z]a[a-z]{4}\n/g).length > 0);
    });

    it('On peut trouver une mot aléatoire selon certains critères.', () => {
        console.log(RechercheMots.rechercherMot(4, [new Contrainte('a', 1)]));
        assert( RechercheMots.rechercherMot(4, [new Contrainte('a', 1)]).length !== 0);
    });

    it('On peut trouver une mot aléatoire selon certains critères: SW*', () => {
        console.log(RechercheMots.rechercherMot(3, [new Contrainte('s', 0), new Contrainte('w', 1)]));
        assert(RechercheMots.rechercherMot(3, [new Contrainte('s', 0), new Contrainte('w', 1)]) === undefined);
    });

    it('Je peux ajouter un mot dans un emplacement avec O en position 1', () => {
        console.log(RechercheMots.rechercherMot(4, [new Contrainte('o', 1)]));
        assert(RechercheMots.rechercherMot(4, [new Contrainte('o', 1)]).length === 4);
    });

    it('Je peux trouver un mot de 5 lettres sans contrainte', () => {
        console.log(RechercheMots.rechercherMot(5, []));
        assert(RechercheMots.rechercherMot(5, []).length === 5);
    });

    it('Je peux trouver un mot de 10 lettres avec 3 contraintes', () => {
        console.log(RechercheMots.rechercherMot(10, [new Contrainte('o', 0), new Contrainte('d', 1), new Contrainte('a', 5)]));
        assert(RechercheMots.rechercherMot(10, [new Contrainte('o', 0), new Contrainte('d', 1), new Contrainte('a', 5)]) !== undefined);
    });
});

