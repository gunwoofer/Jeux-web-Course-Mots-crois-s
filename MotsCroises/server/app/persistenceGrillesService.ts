import { PersistenceGrilleServiceLecture } from './persistenceGrilleServiceLecture';
import { Guid } from '../../commun/Guid';
import { Grille } from './grille';
import * as express from 'express';
import { BDImplementation } from './bDImplementation';
import { GenerateurDeGrilleService } from './generateurDeGrilleService';
import * as Configuration from './configuration';
import { Niveau } from '../../commun/Niveau';


export const nomTableauGrilles = 'grilles';

export class PersistenceGrillesService {
    private reponse: express.Response;
    public message = '';
    public compteurRequetesEntiteePersistente = 0;
    private pretPourEnvoyerReponse = false;
    public generateurDeGrilleService: GenerateurDeGrilleService;
    private aEteEnvoye = false;
    private persistenceGrillesServiceLecture: PersistenceGrilleServiceLecture = new PersistenceGrilleServiceLecture();

    private bdImplementation: BDImplementation = new BDImplementation();

    constructor(generateurDeGrilleService: GenerateurDeGrilleService, reponse?: express.Response) {
        this.generateurDeGrilleService = generateurDeGrilleService;
        if (reponse !== undefined) {
            this.reponse = reponse;
        }
    }

    // LECTURE
    public obtenirGrillePersistante(niveau: Niveau): void {
        this.persistenceGrillesServiceLecture.obtenirGrillePersistante(this, niveau);
    }

    public asyncObtenirGrillePersistante(niveau: Niveau): Promise<Grille> {
        return this.persistenceGrillesServiceLecture.asyncObtenirGrillePersistante(this, niveau);
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

    public connectiondbMotsCroises(callback?: any, donneesAuCallback?: any): void {
        const self: PersistenceGrillesService = this;

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

    public supprimerGrille(self: PersistenceGrillesService, db: any, id: string): void {
        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).deleteOne({ id: id }, (err: any, obj: any) => {
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);

            db.close();
        });
    }

    public insererGrille(grille: Grille): void {
        this.connectiondbMotsCroises(this.procedureRappelInsererGrille, grille);
    }

    public asyncConnectiondbMotsCroises(self: PersistenceGrillesService): Promise<any> {
        return new Promise((resolve: any, reject: any) => {
            self.compteurRequetesEntiteePersistente++;
            self.bdImplementation.seConnecter(Configuration.baseDeDonneesUrl, (err: any, db: any) => {

                self.notifierReponseRecuEntiteePersistente();
                self.asyncVerifierSierrConnection(err, db, reject);

                resolve(db);
            });
        });
    }

    public asyncVerifierSierrConnection(err: any, db: any, reject: any): boolean {
        if (err) {
            reject(err);
            db.close();
            return true;
        }

        return false;
    }

    private procedureRappelInsererGrille(self: PersistenceGrillesService, db: any, grille: Grille): void {
        const grilleStringify: string = JSON.stringify(grille);
        const grilleAInserer: Object = {
            id: Guid.generateGUID(),
            niveau: grille.niveau,
            grille: grilleStringify
        };

        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).insertOne(grilleAInserer, (err: any, res: any) => {
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
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
                .then(result => { resolve(result); })
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
                        niveau: grille.niveau,
                        grille: grilleStringify
                    };
                    grillesAInserer.push(grilleAInserer);
                }

                self.compteurRequetesEntiteePersistente++;
                db.collection(nomTableauGrilles).insertMany(grillesAInserer, (err: any, res: any) => {
                    self.notifierReponseRecuEntiteePersistente();
                    self.asyncVerifierSierrConnection(err, db, self);
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
                niveau: grille.niveau,
                grille: grilleStringify
            };
            grillesAInserer.push(grilleAInserer);
        }

        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).insertMany(grillesAInserer, (err: any, res: any) => {
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.envoyerReponse(' | ' + res.insertedCount + ' grilles insérés');
            db.close();
        });
    }

    public verifierSierrConnection(err: any, db: any, self: PersistenceGrillesService): boolean {
        if (err) {
            db.close();
            self.reponse.send(err);
            return true;
        }

        return false;
    }
}
