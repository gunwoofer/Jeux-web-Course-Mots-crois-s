import * as express from 'express';
import {Message} from '../../../commun/communication/message';
import { GenerateurDeGrilleService } from '../GenerateurDeGrilleService';
import { Grille, Niveau } from '../Grille';

module Route {

    export class Index {

        public GenerationDeGrilleService(req: express.Request, res: express.Response, next: express.NextFunction) {

            let generateur:GenerateurDeGrilleService = new GenerateurDeGrilleService();
            let motsCroises:Grille = generateur.genererGrille(Niveau.facile);           
            
            res.send(JSON.stringify(motsCroises));
        }
    }
}

export = Route;
