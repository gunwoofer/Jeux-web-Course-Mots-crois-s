import { modelAdmin } from './../adminModel';
import * as express from 'express';


module Administrateur {

    export class Index {
        public ajouterAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
            const administrateur = new modelAdmin(req.body);
            administrateur.save((err, resultat) => {
                if (err) {
                    return res.status(500).json({
                        message: 'une erreur est survenue lors de la sauvegarde',
                        error: err,
                    });
                }
                return res.status(200).json({
                    message: 'administrateur sest enregistre',
                    objet: resultat,
                });
            });
        };
    };
}

export = Administrateur;
