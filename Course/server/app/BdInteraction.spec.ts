import { BdImplementation } from './bdImplementation';
import * as chai from 'chai';
import { modelDePiste } from './pisteModel';
import * as configuration from './Configuration';

const piste = new modelDePiste({
    vignette : 'https://thumbs.dreamstime.com/z/cartoon-racing-map-game-49708152.jpg',
    nom: 'pisteUnitTest',
    typeCourse: 'professionnel',
    description: 'pisteVOIr',
    nombreFoisJouee: 0,
    coteAppreciation: 0,
    meilleursTemps: [4, 6, 8, 10, 12],
    listepositions:
    [{ z: 0, y: 24.003569616469644, x: 101.77079099777208 },
    { z: 0, y: 46.826635809178065, x: 41.17161184536442 },
    { z: 0, y: -34.23459928906337, x: 8.511015289197246 },
    { z: 0, y: -43.28512553789595, x: 99.40978401780862 },
    { z: 0, y: 24.003569616469644, x: 101.77079099777208 }],
});

const pisteModifie = new modelDePiste({
    nom: 'pisteModifie',
    typeCourse: 'amateur',
    description: 'pisteVOIr',
    nombreFoisJouee: 0,
    coteAppreciation: 0,
    meilleursTemps: [4, 6, 8, 10, 12],
    listepositions:
    [{ z: 0, y: 3, x: 101.77079099777208 },
    { z: 0, y: 42, x: 41.17161184536442 },
    { z: 0, y: -190.23459928906337, x: 180.511015289197246 },
    { z: 0, y: -14.28512553789595, x: 109.40978401780862 },
    { z: 0, y: 124.003569616469644, x: 102.77079099777208 }],
});

describe('Test unitaire base de données', () => {
    beforeEach((fin) => {
        const expect = chai.expect;
        const bd = new BdImplementation();
        bd.connect(configuration.baseDeDonneesUrl);
        piste.save().then(() => {
            expect(piste.isNew === false);
            fin();
        });
    });

    it('Trouver une piste dans la base de donnée', (fin) => {
        const expect = chai.expect;
        modelDePiste.findOne({ nom: 'pisteUnitTest' })
            .then((result) => {
                expect(result.nom === 'pisteUnitTest');
                fin();
            });
    });

    it('Trouver une piste dans la base de donnée à partir de son Id', (fin) => {
        const expect = chai.expect;
        modelDePiste.findById({ _id: piste._id })
            .then((result) => {
                expect(result.nom === 'pisteUnitTest');
                expect(result._id === piste._id);
                fin();
            });
    });

    it('Trouver une piste dans la base de donnée à partir de son Id et la modifier', (fin) => {
        modelDePiste.findById({ _id: piste._id })
            .then((result) => {
                chai.expect(result.nom === 'pisteUnitTest');
                chai.expect(result._id === piste._id);
                result.nom = pisteModifie.nom;
                result.typeCourse = pisteModifie.typeCourse;
                result.description = pisteModifie.description;
                result.listepositions = pisteModifie.listepositions;
                result.save().then(() => {
                    chai.expect(result.nom !== piste.nom);
                    chai.expect(result.typeCourse !== piste.typeCourse);
                    chai.expect(result.description !== piste.description);
                    chai.expect(result.listepositions !== piste.listepositions);
                    fin();
                });
            });
    });

    it('Trouver une piste dans la base de donnée à partir et la supprimer', (fin) => {
        const expect = chai.expect;
        modelDePiste.findById({ _id: piste._id })
            .then((result) => {
                expect(result.nom === 'pisteUnitTest');
                expect(result._id === piste._id);
                result.remove().then(resultat => {
                    expect(resultat === null);
                    fin();
                });
            });
    });
});

describe('Test unitaire ajout dans la base de données', () => {
    beforeEach((fin) => {
        const bd = new BdImplementation();
        bd.connect(configuration.baseDeDonneesUrl);
        fin();
    });

    it('Ajouter une piste à la base de donnée', (fin) => {
        piste.save().then(() => {
            chai.expect(piste.isNew === false);
            fin();
        });
    });
});


describe('Test unitaire qui verifie le retour dune liste de piste', () => {
    it('retour la taille de la liste de piste quon a dans la base de donne', (fin) => {
        modelDePiste.find().then((resultat) => {
            chai.expect(resultat.length).equal(0);
            fin();
        });
    });
});

