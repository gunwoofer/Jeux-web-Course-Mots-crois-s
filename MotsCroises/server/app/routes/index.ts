import * as express from 'express';
import {Message} from '../../../commun/communication/message';
import { GenerateurDeGrilleService } from '../GenerateurDeGrilleService';


module Route {

    export class Index {

        public GenerationDeGrilleService(req: express.Request, res: express.Response, next: express.NextFunction) {
            let generateur = new GenerateurDeGrilleService();
            generateur.genererGrille();
            res.send(JSON.stringify(generateur));
        }
    }
}

export = Route;
