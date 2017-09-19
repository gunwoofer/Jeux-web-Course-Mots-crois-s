import { assert } from 'chai';
import { Niveau, Grille } from './Grille';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Observateur, TypeObservateur } from './Observateur';
import {PersistenceGrillesService } from './PersistenceGrillesService';

export const maxDelaiRetourRequeteMS: number = 1000;

describe('PersistenceGrillesService', () => {
    it('Le serveur genere une grille facile.', (done) => {
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
});

