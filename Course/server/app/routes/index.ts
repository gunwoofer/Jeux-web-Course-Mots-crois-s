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
                        title: 'une erreur est survenue lors de la sauvegarde',
                        error: err
                    });
                }
                res.status(201).json({
                    message: 'La piste est sauvegardée',
                    obj: resultat
                });
            });
        }

        public retournerPiste(req: express.Request, res: express.Response, next: express.NextFunction) {
            Piste.find((err, pistes) => {
                if (err) {
                    return res.status(500).json({
                        title: 'Une erreur est survenue',
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
            console.log(req.params.id);
            Piste.findById(req.params.id, (err, piste) => {
                if (err) {
                    return res.status(500).json({
                        title: 'Une erreur est survenue',
                        error: err
                    });
                }
                Piste.remove((err: any, resultat: any) => {
                    if (err) {
                        return res.status(500).json({
                            title: 'une erreur est survenue lors de la sauvegarde',
                            error: err
                        });
                    }
                    res.status(201).json({
                        message: 'La piste est supprimée',
                        obj: resultat
                    });
                });

            });
        }
    }
}

export = Route;
