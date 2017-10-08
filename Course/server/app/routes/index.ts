import * as express from 'express';
import { Piste } from '../pisteModel';
import { Message } from '../../../commun/communication/message';

module Route {

    export class Index {

        public ajouterPiste(req: express.Request, res: express.Response, next: express.NextFunction) {
            const piste = new Piste(req.body);
            console.log(piste);
            piste.save((err, resultat) => {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                res.status(201).json({
                    message: 'Save piste',
                    obj: resultat
                });
            });
        }

        public retournerPiste(req: express.Request, res: express.Response, next: express.NextFunction) {
            Piste.find((err, pistes) => {
                if (err) {
                    return res.status(500).json({
                        title: 'An error occurred',
                        error: err
                    });
                }
                res.status(200).json({
                    message: 'Nous avons pu recuperer la liste de piste',
                    obj: pistes
                });
            });
        }

        public supprimerPiste(req: express.Request, res: express.Response, next: express.NextFunction) {
            const message = new Message();
            message.title = 'Hello';
            message.body = 'World';
            res.send(JSON.stringify(message));
        }
    }
}

export = Route;
