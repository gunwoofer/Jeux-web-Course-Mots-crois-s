import * as express from 'express';
import { GenerateurDeGrilleService } from '../GenerateurDeGrilleService';
import { PersistenceGrillesService } from '../PersistenceGrillesService';
import { Grille, Niveau } from '../Grille';

module Route {

    export class Index {

        public GenerationDeGrilleService(req: express.Request, res: express.Response, next: express.NextFunction) {
            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const grille: Grille = generateur.genererGrille(Niveau.facile);

            res.send(JSON.stringify(grille));
        }


        public PersistenceGrillesService(req: express.Request, res: express.Response, next: express.NextFunction) {
            
            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);
            
            persistenceGrilles.insererPlusieursGrilles(generateur.obtenirGrillesBase(generateur));

        }

        public obtenirGrilleFacile(req: express.Request, res: express.Response, next: express.NextFunction) {
            
            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.obtenirGrillePersistante(Niveau.facile);
        }

        public creerTableauGrille(req: express.Request, res: express.Response, next: express.NextFunction) {
            
            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.creerTableauGrilles();

        }
        
        public obtenirGrilleMoyen(req: express.Request, res: express.Response, next: express.NextFunction) {
            
            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.obtenirGrillePersistante(Niveau.moyen);
        }
        
        public obtenirGrilleDifficile(req: express.Request, res: express.Response, next: express.NextFunction) {
            
            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.obtenirGrillePersistante(Niveau.difficile);
        }
    }
}

export = Route;
