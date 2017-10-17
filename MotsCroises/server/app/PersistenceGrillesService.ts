import { Guid } from '../../commun/Guid';
import { Niveau } from '../../commun/Niveau';
import { Grille } from './Grille';
import * as express from 'express';
import { Observateur } from './Observateur';
import { BDImplementation } from './BDImplementation';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import * as Configuration from './Configuration';


export const nomTableauGrilles = 'grilles';

export class PersistenceGrillesService {
    private reponse: express.Response;
    public message = '';
    private compteurRequetesEntiteePersistente = 0;
    private pretPourEnvoyerReponse = false;
    private observateurs: Observateur[] = new Array();
    private generateurDeGrilleService: GenerateurDeGrilleService;
    private aEteEnvoye = false;

    private bdImplementation: BDImplementation = new BDImplementation();

    constructor(generateurDeGrilleService: GenerateurDeGrilleService, reponse?: express.Response) {
        this.generateurDeGrilleService = generateurDeGrilleService;
        if (reponse !== undefined) {
            this.reponse = reponse;
        }
    }

    public inscrire(observateur: Observateur) {
        this.observateurs.push(observateur);
    }

    public notifier(): void {
        for (const observateur of this.observateurs) {
            observateur.notifier();
        }
    }

    public envoyerReponse(message: string): void {
        this.message += message;

        if (this.pretPourEnvoyerReponse && this.reponse !== undefined && (!this.aEteEnvoye)) {
            this.reponse.send(this.message);
            this.aEteEnvoye = true;
        }
    }

    public notifierReponseRecuEntiteePersistente(): void {
        this.compteurRequetesEntiteePersistente--;

        if (this.compteurRequetesEntiteePersistente === 0) {
            this.pretPourEnvoyerReponse = true;
        }
    }

    private connectiondbMotsCroises(callback?: any, donneesAuCallback?: any): void {
        const self: PersistenceGrillesService = this;

        // Connexion à la base de données persistente.
        this.compteurRequetesEntiteePersistente++;
        this.bdImplementation.seConnecter(Configuration.baseDeDonneesUrl, (err: any, db: any) => {

            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);

            if (callback !== undefined) {
                if (donneesAuCallback !== undefined) {
                    callback(self, db, donneesAuCallback);
                } else {
                    callback(self, db);
                }
            } else {
                db.close();
            }
        });
    }

    public creerTableauGrilles(): void {
        this.connectiondbMotsCroises(this.procedureRappelCreerTableauGrilles);
    }

    private procedureRappelCreerTableauGrilles(self: PersistenceGrillesService, db: any): void {
        self.compteurRequetesEntiteePersistente++;
        db.createCollection(nomTableauGrilles, (err: any, res: any) => {
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.notifier();
            self.envoyerReponse(' | Collection créé !');
            db.close();
        });
    }

    private supprimerGrille(self: PersistenceGrillesService, db: any, id: string): void {
        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).deleteOne({ id: id }, (err: any, obj: any) => {
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.notifier();

            db.close();
        });
    }

    public insererGrille(grille: Grille): void {
        this.connectiondbMotsCroises(this.procedureRappelInsererGrille, grille);
    }

    public obtenirGrillePersistante(niveau: Niveau): void {
        this.connectiondbMotsCroises(this.procedureRappelObtenirGrille, niveau);
    }

    public asyncObtenirGrillePersistante(niveau: Niveau): Promise<Grille> {
        const self: PersistenceGrillesService = this;

        return new Promise((resolve: any, reject: any) => {
            self.asyncConnectiondbMotsCroises(self)
                .then(db => self.asyncProcedureRappelObtenirGrille(self, db, niveau))
                .then(result => { resolve(result); })
                .catch(error => { reject(error); });
        });
    }

    public asyncConnectiondbMotsCroises(self: PersistenceGrillesService): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            // Connexion à la base de données persistente.
            self.compteurRequetesEntiteePersistente++;
            self.bdImplementation.seConnecter(Configuration.baseDeDonneesUrl, (err: any, db: any) => {

                self.notifierReponseRecuEntiteePersistente();
                self.asyncVerifierSierrConnection(err, db, reject);

                resolve(db);
            });
        });
    }

    private asyncVerifierSierrConnection(err: any, db: any, reject: any): boolean {
        if (err) {
            reject(err);
            db.close();
            return true;
        }

        return false;
    }

    private asyncProcedureRappelObtenirGrille(self: PersistenceGrillesService, db: any, niveau: Niveau): Promise<Grille> {

        return new Promise(
            (resolve: any, reject: any) => {
                self.compteurRequetesEntiteePersistente++;
                db.collection(nomTableauGrilles).find({ niveau: niveau }).toArray((err: any, result: any) => {

                    self.notifierReponseRecuEntiteePersistente();
                    self.asyncVerifierSierrConnection(err, db, reject);
                    resolve(Grille.creerInstanceAvecJSON(result[0].grille.replace('\\', '')));
                    self.notifier();

                    self.supprimerGrille(self, db, result[0].id);
                    self.insererGrille(self.generateurDeGrilleService.genererGrille(niveau));
                    db.close();
                });
            }
        );
    }

    private procedureRappelObtenirGrille(self: PersistenceGrillesService, db: any, niveau: Niveau): void {

        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).find({ niveau: niveau }).toArray((err: any, result: any) => {

            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.envoyerReponse(result[0].grille.replace('\\', ''));
            self.notifier();

            self.supprimerGrille(self, db, result[0].id);
            self.insererGrille(self.generateurDeGrilleService.genererGrille(niveau));
            db.close();
        });
    }

    private procedureRappelInsererGrille(self: PersistenceGrillesService, db: any, grille: Grille): void {
        const grilleStringify: string = JSON.stringify(grille);
        const grilleAInserer: Object = {
            id: Guid.generateGUID(),
            niveau: grille.obtenirNiveau(),
            grille: grilleStringify
        };

        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).insertOne(grilleAInserer, (err: any, res: any) => {
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.notifier();
            self.envoyerReponse('| 1 grille inséré');
            db.close();
        });
    }

    public insererPlusieursGrilles(grilles: Grille[]): void {
        this.connectiondbMotsCroises(this.procedureRappelInsererplusieursGrilles, grilles);
    }

    public asyncInsererPlusieursGrilles(grilles: Grille[]): Promise<string> {
        const self: PersistenceGrillesService = this;

        return new Promise((resolve: any, reject: any) => {
            self.asyncConnectiondbMotsCroises(self)
                .then(db => self.asyncProcedureRappelInsererplusieursGrilles(self, db, grilles))
                .then(result => { resolve(result) })
                .catch(error => { reject(error); });
        });
    }

    private asyncProcedureRappelInsererplusieursGrilles(self: PersistenceGrillesService, db: any, grilles: Grille[]): Promise<string> {
        return new Promise(
            (resolve: any, reject: any) => {

                let grilleStringify: string;
                let grilleAInserer: Object;
                const grillesAInserer: Object[] = new Array();

                for (const grille of grilles) {
                    grilleStringify = JSON.stringify(grille);
                    grilleAInserer = {
                        id: Guid.generateGUID(),
                        niveau: grille.obtenirNiveau(),
                        grille: grilleStringify
                    };
                    grillesAInserer.push(grilleAInserer);
                }

                self.compteurRequetesEntiteePersistente++;
                db.collection(nomTableauGrilles).insertMany(grillesAInserer, (err: any, res: any) => {
                    self.notifierReponseRecuEntiteePersistente();
                    self.asyncVerifierSierrConnection(err, db, self);
                    self.notifier();
                    resolve(' | ' + res.insertedCount + ' grilles insérés (async)');
                    db.close();
                });
            }
        );
    }

    private procedureRappelInsererplusieursGrilles(self: PersistenceGrillesService, db: any, grilles: Grille[]): void {
        let grilleStringify: string;
        let grilleAInserer: Object;
        const grillesAInserer: Object[] = new Array();

        for (const grille of grilles) {
            grilleStringify = JSON.stringify(grille);
            grilleAInserer = {
                id: Guid.generateGUID(),
                niveau: grille.obtenirNiveau(),
                grille: grilleStringify
            };
            grillesAInserer.push(grilleAInserer);
        }

        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).insertMany(grillesAInserer, (err: any, res: any) => {
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.notifier();
            self.envoyerReponse(' | ' + res.insertedCount + ' grilles insérés');
            db.close();
        });
    }

    private verifierSierrConnection(err: any, db: any, self: PersistenceGrillesService): boolean {
        if (err) {
            db.close();
            self.reponse.send(err);
            return true;
        }

        return false;
    }
}
