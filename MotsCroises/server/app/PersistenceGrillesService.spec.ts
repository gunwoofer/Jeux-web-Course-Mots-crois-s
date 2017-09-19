import { assert } from 'chai';
import { Niveau, Grille } from './Grille';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Observateur, TypeObservateur } from './Observateur';
import {PersistenceGrillesService } from './PersistenceGrillesService';

export const maxDelaiRetourRequeteMS: number = 1000;

describe('PersistenceGrillesService', () => {
    it('Il est possible d\'obtenir une grille facile de la base de données.', (done) => {
        let generateur:GenerateurDeGrilleService = new GenerateurDeGrilleService();
        let persistenceGrillesService:PersistenceGrillesService = new PersistenceGrillesService(generateur);
        
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
        let generateur:GenerateurDeGrilleService = new GenerateurDeGrilleService();
        let persistenceGrillesService:PersistenceGrillesService = new PersistenceGrillesService(generateur);
        
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
        let generateur:GenerateurDeGrilleService = new GenerateurDeGrilleService();
        let persistenceGrillesService:PersistenceGrillesService = new PersistenceGrillesService(generateur);
        
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
});

