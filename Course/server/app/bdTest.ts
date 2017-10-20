import { BdImplementation } from './bdImplementation';
import * as chai from 'chai';

describe('Test unitaire base de données', () => {
    it('connection a la base de donne', () => {
        const bd = new BdImplementation();
        const expect = chai.expect;

        const valeurRetour = bd.connect('mongodb://LOG2990-10:rK54nG58@parapluie.info.polymtl.ca:27017/LOG2990-10-db');
        expect(valeurRetour === true);
        expect(valeurRetour === true);
    });
});
