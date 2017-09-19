import { assert } from 'chai';
import { Niveau, Grille } from './Grille';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import {PersistenceGrillesService } from './PersistenceGrillesService';

export const maxDelaiRetourRequeteMS = 1000;
export const maxDelaiInserer15Grilles = 10000;

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
        const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
        const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur);
        const grilles: Grille[] = generateur.obtenirGrillesBase(generateur);

        persistenceGrilles.asyncInsererPlusieursGrilles(grilles)
            .then(resultat => {
                    assert(resultat !== undefined);
                    done();
            })
            .catch(erreur => {
                assert(false);
                done();
            });
    }).timeout(maxDelaiInserer15Grilles);

});

