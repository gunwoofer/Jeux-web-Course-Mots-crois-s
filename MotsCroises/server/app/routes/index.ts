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
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(res);
            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const grille1: Grille = generateur.genererGrille(Niveau.facile);
            const grille2: Grille = generateur.genererGrille(Niveau.facile);
            const grille3: Grille = generateur.genererGrille(Niveau.facile);
            const grille4: Grille = generateur.genererGrille(Niveau.facile);
            const grille5: Grille = generateur.genererGrille(Niveau.facile);

            let grilles:Grille[] = [grille1, grille2, grille3, grille4, grille5];
            
            //persistenceGrilles.creerTableauGrilles();
            //persistenceGrilles.insererGrille(grille1);
            persistenceGrilles.insererPlusieursGrilles(grilles);

        }
    }
}

export = Route;
