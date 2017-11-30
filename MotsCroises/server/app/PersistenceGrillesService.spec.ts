import { assert } from 'chai';
import { Grille } from './Grille';
import { Niveau } from '../../commun/Niveau';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { PersistenceGrillesService } from './PersistenceGrillesService';
import { GenerateurDeGrilleServiceMock } from './GenerateurDeGrilleServiceMock';

export const maxDelaiRetourRequeteMS = 20000;
export const maxDelaiInserer15Grilles = 5000;

describe('PersistenceGrillesService', () => {
    it('Il est possible d\'obtenir une grille facile de la base de données.', (done) => {
        const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateur);

        persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.facile)
            .then(grille => {
                assert(grille);
                done();
            })
            .catch(erreur => {
                assert(false);
                done(erreur);
            });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible d\'obtenir une grille moyenne de la base de données.', (done) => {
        const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateur);

        persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.moyen)
            .then(grille => {
                assert(grille);
                done();
            })
            .catch(erreur => {
                assert(false);
                done(erreur);
            });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible d\'obtenir une grille difficile de la base de données.', (done) => {
        const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateur);

        persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.difficile)
            .then(grille => {
                assert(grille);
                done();
            })
            .catch(erreur => {
                assert(false);
                done(erreur);
            });
    }).timeout(maxDelaiRetourRequeteMS);

    it('Il est possible de creer 5 grilles de chaque niveau dans la base de données.', (done) => {
        const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
        const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur);
        generateur.obtenirGrillesBase().then((grilles) => {
            persistenceGrilles.asyncInsererPlusieursGrilles(grilles)
            .then(resultat => {
                assert(resultat !== undefined);
                done();
            })
            .catch(erreur => {
                assert(false);
                done();
            });
        });
    }).timeout(maxDelaiInserer15Grilles);

});

