import * as express from 'express';
import { Piste, PisteModel } from '../pisteModel';

module Route {

    export class Index {

        public ajouterPiste(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const piste = new Piste(req.body);
            piste.save((err: any, objetPiste: PisteModel) => {
                if (err) {
                    this.fonctionErreur(res, 'une erreur est survenue lors de la sauvegarde', err, 500);
                }
                res.status(201).json({
                    message: 'La piste est sauvegardée',
                    obj: objetPiste
                });
            });
        }

        public retournerPiste(req: express.Request, res: express.Response, next: express.NextFunction): void {
            Piste.find((err: any, pistes: PisteModel[]) => {
                if (err) {
                    this.fonctionErreur(res, 'Une erreur est survenue', err, 500);
                }
                res.status(200).json({
                    message: 'Nous avons pu recuperer la liste de piste',
                    obj: pistes
                });
            });
        }

        public supprimerPiste(req: express.Request, res: express.Response, next: express.NextFunction): void {
            Piste.findById(req.params.id, (err: any, piste: PisteModel) => {
                if (err) {
                    this.fonctionErreur(res, 'Une erreur est survenue', err, 500);
                }
                piste.remove((error: any, resultat: any) => {
                    if (err) {
                        this.fonctionErreur(res, 'Une erreur est survenue lors de la sauvegarde', err, 500);
                    }
                    res.status(201).json({
                        message: 'La piste est supprimée',
                        obj: resultat
                    });
                });
            });
        }

        public modifierPiste(req: express.Request, res: express.Response, next: express.NextFunction): void {
            Piste.findById(req.params.id, (err: any, piste: PisteModel) => {
                if (err) {
                    this.fonctionErreur(res, 'Une erreur est survenue', err, 500);
                }
                piste.typeCourse = req.body.typeCourse;
                piste.description = req.body.description;
                piste.listepositions = req.body.listepositions;
                piste.save((error: any, resultat: PisteModel) => {
                    if (err) {
                        this.fonctionErreur(res, 'une erreur est survenue lors de la modification', err, 500);
                    }
                    res.status(200).json({
                        message: 'La piste est modifie',
                        obj: resultat
                    });
                });
            });
        }

        public fonctionErreur(res: express.Response, message: string, err: any, statue: number): express.Response {
            return res.status(statue).json({
                titre: message,
                error: err
            });
        }
    }

}

export = Route;
