import { BdImplementation } from './bdImplementation';
import * as chai from 'chai';
import { modelAdmin } from './adminModel';

const admin = new modelAdmin({
    nomUtilisateur : 'a-7',
    nom: 'Doe',
    prenom: 'John',
    email: 'john.Doe@gmail.com',
    motDePasse: 'Hello',
});

describe('Test unitaire base de données pour la collection administrateur', () => {
    beforeEach((fin) => {
        const expect = chai.expect;
        const bd = new BdImplementation();
        bd.connect('mongodb://localhost/BdpisteTest');
        admin.save().then(() => {
            expect(admin.isNew === false);
            fin();
        });
    });

    it('retourne nombre dans la base de donnée, il équivaut à 1', (fin) => {
        const expect = chai.expect;
        modelAdmin.find().then((resultat) => {
            chai.expect(resultat.length).equal(1);
            fin();
        });
    });
});
