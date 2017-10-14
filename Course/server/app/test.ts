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
    beforeEach((fin) => {
        const bd = new BdImplementation();
        bd.connect();
        fin();
    });

    it('Ajouter une piste à la base de donnée', (fin) => {
        const expect = chai.expect;

        piste.save().then(() => {
            // not new have been saved in the database
            expect(piste.isNew === false);
            fin();
        });

    });

    it('Trouver une piste dans la base de donnée', (fin) => {
        const expect = chai.expect;
        Piste.findOne({ nom: 'pisteUnitTest' })
            .then((result) => {
                expect(result.nom === 'pisteUnitTest');
                fin();
            });
    });

    it('Trouver une piste dans la base de donnée à partir de son Id', (fin) => {
        const expect = chai.expect;
        Piste.findById({ _id: piste._id })
            .then((result) => {
                expect(result.nom === 'pisteUnitTest');
                fin();
            });
    });
});


