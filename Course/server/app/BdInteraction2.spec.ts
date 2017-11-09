import { BdImplementation } from './bdImplementation';
import * as configuration from './Configuration';
import * as chai from 'chai';

describe('Test unitaire base de données', () => {
    it('connection a la base de donne', () => {
        const bd = new BdImplementation();
        const expect = chai.expect;

        const valeurRetour = bd.connect(configuration.baseDeDonneesUrlTest);
        expect(valeurRetour === true);
    });
});
