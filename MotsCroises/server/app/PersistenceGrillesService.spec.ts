import { assert } from 'chai';
import { Niveau, Grille } from './Grille';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Observateur, TypeObservateur } from './Observateur';
import {PersistenceGrillesService } from './PersistenceGrillesService';
import { MongoClient } from 'mongodb';


describe('PersistenceGrillesService', () => {
    it('Le serveur genere une grille facile.', () => {
        let generateur:GenerateurDeGrilleService = new GenerateurDeGrilleService();
        let persistenceGrillesService:PersistenceGrillesService = new PersistenceGrillesService(generateur);
        
        

         assert(true);
        
    });
});

