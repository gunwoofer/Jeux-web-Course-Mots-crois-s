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
                res.status(200).json({
                    message: 'administrateur sest enregistre',
                    objet: resultat,
                });
            });
        };

        public retournerNombreAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
            modelAdmin.find((err, resultats) => {
                if (err) {
                    return res.status(500).json({
                        message: 'une erreur est survenue',
                        error: err,
                    });
                }
                res.status(200).json({
                    objet: resultats.length,
                });
            });
        };

        public retournerMotDepasse(req: express.Request, res: express.Response, next: express.NextFunction) {
            modelAdmin.findOne({ email: req.params.email }, (err, resultat) => {
                if (err) {
                    return res.status(500).json({
                        message: 'une erreur est survenue',
                        error: err,
                    });
                }
                if (!resultat) {
                    return res.status(500).json({
                        message: 'il nexiste pas',
                    });
                }
                res.status(200).json({
                    motDePasse: resultat.motDePasse,
                });
            });
        };

        public seConnecter(req: express.Request, res: express.Response, next: express.NextFunction) {
            modelAdmin.findOne({ email: req.body.email }, (err, admin) => {
                if (err) {
                    return res.status(500).json({
                        message: 'une erreur est survenue',
                        error: err,
                    });
                }
                if (!admin || (admin.motDePasse !== req.body.motDePasse)) {
                    return res.status(500).json({
                        message: 'il nexiste pas un administrateur avec ces informations',
                    });
                }
                res.status(200).json({
                    message: 'connexion est approuve',
                    nomUtilisateur: admin.nomUtilisateur
                });
            });
        };

        public modifierMotDePasse(req: express.Request, res: express.Response, next: express.NextFunction) {
            modelAdmin.findOne({ email: req.body.email }, (err, admin) => {
                if (err) {
                    return res.status(500).json({
                        message: 'une erreur est survenue',
                        error: err,
                    });
                }
                if (!admin || (admin.motDePasse !== req.body.ancienMotDpass)) {
                    return res.status(500).json({
                        message: 'il nexiste pas un administrateur avec ces informations',
                    });
                }
                admin.motDePasse = req.body.nouveauMotDpass;
                admin.save((error, resultat) => {
                    if (err) {
                        return res.status(500).json({
                            title: 'une erreur est survenue lors de la modification',
                            error: err
                        });
                    }
                    res.status(200).json({
                        message: 'Le mot de passe a été modifié',
                        obj: resultat
                    });
                });
            });
        };
    };
}

export = Administrateur;
