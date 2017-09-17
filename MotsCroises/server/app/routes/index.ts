import * as express from 'express';
import { GenerateurDeGrilleService } from '../GenerateurDeGrilleService';
import { PersistenceGrillesService } from '../PersistenceGrillesService';
import { Grille, Niveau } from '../Grille';

module Route {

    export class Index {

        public GenerationDeGrilleService(req: express.Request, res: express.Response, next: express.NextFunction) {
            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const motsCroises: Grille = generateur.genererGrille(Niveau.facile);

            res.send(JSON.stringify(motsCroises));
        }


        public PersistenceGrillesService(req: express.Request, res: express.Response, next: express.NextFunction) {
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(res);
            persistenceGrilles.connectiondbMotsCroises();
            persistenceGrilles.creerTableauGrilles();

        }
    }
}

export = Route;
