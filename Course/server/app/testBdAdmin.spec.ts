import { BdImplementation } from './bdImplementation';
import * as chai from 'chai';
import { modelAdmin } from './adminModel';
import * as configuration from './Configuration';

const admin = new modelAdmin({
    nomUtilisateur: 'a-7',
    nom: 'Doe',
    prenom: 'John',
    email: 'john.Doe@gmail.com',
    motDePasse: 'Hello',
});

const nouveauMotPasse = 'ALLLOOO';



describe('Test unitaire base de données pour la collection administrateur', () => {
    beforeEach((fin) => {
        const bd = new BdImplementation();
        bd.connect(configuration.baseDeDonneesUrlTest);
        fin();
    });

    it('Ajouter dun admin à la base de donnée', (fin) => {
        admin.save().then(() => {
            chai.expect(admin.isNew === false);
            fin();
        });
    });

    it('trouver le mot de passe dun admin dans la base de donnée', (fin) => {
        const expect = chai.expect;
        modelAdmin.findOne({ email: admin.email })
            .then((result) => {
                expect(result.nom === admin.nom);
                expect(result.motDePasse === admin.motDePasse);
                fin();
            });
    });

    it('se connecter à partir de lemail et voir si le mot de passe est correct, on retourne le nom dadmin', (fin) => {
        const expect = chai.expect;
        modelAdmin.findOne({ email: admin.email })
            .then((result) => {
                expect(result.email === admin.email);
                expect(result.motDePasse === admin.motDePasse);
                fin();
            });
    });

    it('modification du mot de passe', (fin) => {
        modelAdmin.findOneAndUpdate({ motDePasse: admin.motDePasse }, { motDePasse: nouveauMotPasse })
            .then(() => {
                modelAdmin.findOne({ _id: admin._id }).then((result) => {
                    chai.expect(result.motDePasse === nouveauMotPasse);
                    fin();
                });
            });
    });

    it('retourne le nombre dadmin dans la base de donnée', (fin) => {
        modelAdmin.find().then((resultat) => {
            chai.expect(resultat.length !== 0);
            chai.expect(resultat.length).greaterThan(0);
            fin();
        });
    });
});








