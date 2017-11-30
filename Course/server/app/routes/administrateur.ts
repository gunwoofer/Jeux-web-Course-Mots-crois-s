import { AdminModel, modelAdmin } from './../adminModel';
import * as express from 'express';


module Administrateur {

    export class Index {
        public ajouterAdmin(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const administrateur = new modelAdmin(req.body);
            administrateur.save((err: any, admin: AdminModel) => {
                if (err) {
                    return res.status(500).json({
                        message: 'une erreur est survenue lors de la sauvegarde',
                        error: err,
                    });
                }
                res.status(200).json({
                    message: 'administrateur sest enregistre'
                });
            });
        };

        public retournerNombreAdmin(req: express.Request, res: express.Response, next: express.NextFunction): void {
            modelAdmin.find((err: any, admins: AdminModel[]) => {
                if (err) {
                    return res.status(500).json({
                        message: 'une erreur est survenue',
                        error: err,
                    });
                }
                res.status(200).json({
                    objet: admins.length,
                });
            });
        };

        public retournerMotDepasse(req: express.Request, res: express.Response, next: express.NextFunction): void {
            modelAdmin.findOne({ email: req.params.email }, (err: any, admin: AdminModel) => {
                if (err) {
                    return res.status(500).json({
                        message: 'une erreur est survenue',
                    });
                }
                if (!admin) {
                    return res.status(500).json({
                        message: 'cet administrateur nexiste pas dans la base de données',
                    });
                }
                res.status(200).json({
                    message: 'votre mot de passe est: ' + admin.motDePasse,
                });
            });
        };

        public seConnecter(req: express.Request, res: express.Response, next: express.NextFunction): void {
            modelAdmin.findOne({ email: req.body.email }, (err: any, admin: AdminModel) => {
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

        public modifierMotDePasse(req: express.Request, res: express.Response, next: express.NextFunction): void {
            modelAdmin.findOne({ email: req.body.email }, (err: any, admin: AdminModel) => {
                if (err) {
                    return res.status(500).json({
                        message: 'une erreur est survenue',
                        error: err,
                    });
                }
                if (!admin || (admin.motDePasse !== req.body.ancienMotDpass)) {
                    return res.status(500).json({
                        message: 'Les informations fournis ne sont pas authentiques',
                        error: err,
                    });
                }
                admin.motDePasse = req.body.nouveauMotDpass;
                admin.save((error, resultat) => {
                    if (err) {
                        return res.status(500).json({
                            message: 'une erreur est survenue lors de la modification',
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
