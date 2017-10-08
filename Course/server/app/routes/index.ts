import * as express from 'express';
import { Piste } from '../pisteModel';

module Route {

    export class Index {

       /*public index(req: express.Request, res: express.Response, next: express.NextFunction) {
            const message = new Message();
            message.title = 'Hello';
            message.body = 'World';
            res.send(JSON.stringify(message));
        }*/

        public ajouterPiste(req: express.Request, res: express.Response, next: express.NextFunction) {
            const piste = new Piste(req.body);
            console.log(piste);
            piste.save((err, result) => {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                res.status(201).json({
                    message: 'Save piste',
                    obj: result
                });
            });

        }
    }
}

export = Route;
