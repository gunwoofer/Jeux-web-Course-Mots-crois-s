import { BdImplementation } from './bdImplementation';
import * as chai from 'chai';
import { modelAdmin } from './adminModel';

const admin = new modelAdmin({
    nomUtilisateur: 'a-7',
    nom: 'Doe',
    prenom: 'John',
    email: 'john.Doe@gmail.com',
    motDePasse: 'Hello',
});

describe('Test unitaire base de données pour la collection administrateur (on ajoute un admin)', () => {
    beforeEach((fin) => {
        const bd = new BdImplementation();
        bd.connect('mongodb://localhost/BdadminTest');
        fin();
    });

    it('Ajouter une piste à la base de donnée', (fin) => {
        admin.save().then(() => {
            chai.expect(admin.isNew).equal(false);
            fin();
        });
    });

    it('trouver le mot de passe dun admin dans la base de donnée', (fin) => {
        const expect = chai.expect;
        modelAdmin.findOne({ email: 'john.Doe@gmail.com' })
            .then((result) => {
                expect(result.nom).equal(admin.nom);
                expect(result.motDePasse).equal(admin.motDePasse);
                fin();
            });
    });

    it('se connecter à partir de lemail et voir si le mot de passe est correct, on retourne le nom dadmin', (fin) => {
        const expect = chai.expect;
        modelAdmin.findOne({ email: 'john.Doe@gmail.com' })
            .then((result) => {
                expect(result.email === admin.email);
                expect(result.motDePasse === admin.motDePasse);
                fin();
            });
    });

    it('retourne le nombre dadmin dans la base de donnée', (fin) => {
        modelAdmin.find().then((resultat) => {
            chai.expect(resultat.length).not.equal(0);
            chai.expect(resultat.length).greaterThan(0);
            fin();
        });
    });
});








