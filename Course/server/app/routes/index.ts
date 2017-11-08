import * as express from 'express';
import { modelDePiste } from '../pisteModel';


module Route {

    export class Index {

        public ajouterPiste(req: express.Request, res: express.Response, next: express.NextFunction) {
            const piste = new modelDePiste(req.body);
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
            modelDePiste.find((err, pistes) => {
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
            modelDePiste.findById(req.params.id, (err, piste) => {
                if (err) {
                    return res.status(500).json({
                        title: 'Une erreur est survenue',
                        error: err
                    });
                }
                piste.remove((error: any, resultat: any) => {
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
        public modifierPiste(req: express.Request, res: express.Response, next: express.NextFunction) {
            modelDePiste.findById(req.params.id, (err, piste) => {
                if (err) {
                    return res.status(500).json({
                        title: 'Une erreur est survenue',
                        error: err
                    });
                }
                piste.typeCourse = req.body.typeCourse;
                piste.description = req.body.description;
                piste.listepositions = req.body.listepositions;
                piste.save((error: any, resultat: any) => {
                    if (err) {
                        return res.status(500).json({
                            title: 'une erreur est survenue lors de la modification',
                            error: err
                        });
                    }
                    res.status(200).json({
                        message: 'La piste est modifie',
                        obj: resultat
                    });
                });

            });
        }

        public modifierTableauPiste(req: express.Request, res: express.Response, next: express.NextFunction) {
            modelDePiste.findById(req.params.id, (err, piste) => {
                if (err) {
                    return res.status(500).json({
                        title: 'Une erreur est survenue',
                        error: err
                    });
                }
                piste.meilleursTemps = req.body.meilleursTemps;
                piste.save((error: any, resultat: any) => {
                    if (err) {
                        return res.status(500).json({
                            title: 'une erreur est survenue lors de la modification',
                            error: err
                        });
                    }
                    res.status(200).json({
                        message: 'Le tableau de temps est modifie',
                        obj: resultat
                    });
                });

            });
        }

        public modifierRating(req: express.Request, res: express.Response, next: express.NextFunction) {
            modelDePiste.findById(req.params.id, (err, piste) => {
                if (err) {
                    return res.status(500).json({
                        title: 'Une erreur est survenue',
                        error: err
                    });
                }
                piste.coteAppreciation = req.body.coteAppreciation;
                piste.save((error: any, resultat: any) => {
                    if (err) {
                        return res.status(500).json({
                            title: 'une erreur est survenue lors de la modification',
                            error: err
                        });
                    }
                    res.status(200).json({
                        message: 'Le tableau de rating est modifie',
                        obj: resultat
                    });
                });

            });
        }
    }
}

export = Route;
