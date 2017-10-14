import { BdImplementation } from './bdImplementation';
import * as chai from 'chai';
import * as mocha from 'mocha';
import * as mongoose from 'mongoose';
import { Piste } from './pisteModel';

const piste = new Piste({
    nom: 'pisteUnitTest',
    typeCourse: 'pisteVoir',
    description: 'pisteVOIr',
    nombreFoisJouee: 0,
    coteAppreciation: 0,
    meilleursTemps: [4, 6, 8, 10, 12]
});

describe('Test unitaire base de données', () => {
    it('connection a la base de donne', () => {
        const bd = new BdImplementation();
        const expect = chai.expect;

        const valeurRetour = bd.connect();
        expect(valeurRetour === true);
        expect(valeurRetour === true);
    });

    it('Ajoute une piste à la base de donnée', (fin) => {
        const expect = chai.expect;

        piste.save().then(() => {
            // not new have been saved in the database
            expect(piste.isNew === false);
            fin();
        });

    });
});


