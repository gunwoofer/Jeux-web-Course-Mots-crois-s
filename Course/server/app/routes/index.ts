import * as express from 'express';
import { Message } from '../../../commun/communication/message';
import { Piste } from '../pisteModel';

module Route {

    export class Index {

        public index(req: express.Request, res: express.Response, next: express.NextFunction) {
            const message = new Message();
            message.title = 'Hello';
            message.body = 'World';
            res.send(JSON.stringify(message));
        }

        public ajouterPiste(req: express.Request, res: express.Response, next: express.NextFunction) {
            const data = 'Hello World !';
            res.send(JSON.stringify(data));
            const piste = new Piste(req.body);
            console.log(piste);
        }
    }
}

export = Route;
