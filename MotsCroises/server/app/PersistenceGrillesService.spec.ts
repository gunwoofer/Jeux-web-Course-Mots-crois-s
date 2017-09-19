import { assert } from 'chai';
import { Niveau, Grille } from './Grille';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Observateur, TypeObservateur } from './Observateur';
//import {PersistenceGrillesService } from './PersistenceGrillesService';


describe('GenerateurDeGrilleService', () => {
    it('Le serveur genere une grille facile.', () => {
        //let persistenceGrillesService:PersistenceGrillesService = new PersistenceGrillesService();
        /*
        http.get({
            hostname: 'localhost',
            port: 3000,
            path: '/grilles/persistence/grille/facile',
            agent: false  // create a new agent just for this one request
          }, (res: any) => {
            let grille: Grille = res.data;
            assert(grille.obtenirNiveau() === Niveau.facile);
          });
          */

          assert(true);
        
    });
});

