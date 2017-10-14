import { BdImplementation } from './bdImplementation';
import * as chai from 'chai';
import * as mocha from 'mocha';
import * as mongoose from 'mongoose';
import { Piste } from './pisteModel';



describe('Test unitaire base de données', () => {
    it('connection a la base de donne', () => {
        const bd = new BdImplementation();
        const expect = chai.expect;

        const valeurRetour = bd.connect();
        expect(valeurRetour === true);
    });
});


