import { Guid } from './Guid';
import { Grille, Niveau } from './Grille';
import * as express from 'express';
import { Observateur } from './Observateur';
import { MongoClient } from 'mongodb';


export const nomTableauGrilles:string = 'grilles';

// Connection URL
const url = 'mongodb://localhost:27017/motscroises';

export class PersistenceGrillesService {
    private reponse:  express.Response;
    public message: string = '';
    private compteurRequetesEntiteePersistente: number = 0;
    private pretPourEnvoyerReponse:boolean = false;
    private observateurs: Observateur[] = new Array();

    constructor (reponse?:  express.Response) {
        if(reponse !== undefined) {
            this.reponse = reponse;
        }
    }

    public inscrire(observateur:Observateur) {
        this.observateurs.push(observateur);
    }

    public notifier() {
        for(let observateur of this.observateurs) {
            observateur.notifier();
        }
    }

    public envoyerReponse(message: string){
        this.message += message;

        if(this.pretPourEnvoyerReponse && this.reponse !== undefined) {
            this.reponse.send(this.message);
        }
    }

    public notifierReponseRecuEntiteePersistente() {
        this.compteurRequetesEntiteePersistente--;

        if(this.compteurRequetesEntiteePersistente === 0) {
            this.pretPourEnvoyerReponse = true;
        }
    }

    private connectiondbMotsCroises(callback?: any, donneesAuCallback?: any) {
        let self: PersistenceGrillesService = this;

       // Connexion à la base de données persistente.
       this.compteurRequetesEntiteePersistente++;
        MongoClient.connect(url, function(err: any, db: any) {   

            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);          

            if(callback !== undefined) {
                if(donneesAuCallback !== undefined) {
                    callback(self, db, donneesAuCallback);
                } else {
                    callback(self, db);
                }
            } else {
                db.close();
            }
            
        });
    }

    public creerTableauGrilles() {
        this.connectiondbMotsCroises(this.procedureRappelCreerTableauGrilles);
    }

    private procedureRappelCreerTableauGrilles(self:PersistenceGrillesService, db: any) {

        self.compteurRequetesEntiteePersistente++;
        db.createCollection(nomTableauGrilles, function(err: any, res: any) {
            
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.notifier();
            self.envoyerReponse(' | Collection créé !');
            
            db.close();
        });
    }

    public insererGrille(grille:Grille) {
        this.connectiondbMotsCroises(this.procedureRappelInsererGrille, grille);
    }

    public obtenirGrillePersistante(niveau: Niveau) {
        this.connectiondbMotsCroises(this.procedureRappelObtenirGrille, niveau);
    }

    private procedureRappelObtenirGrille(self: PersistenceGrillesService, db: any, niveau: Niveau) {

        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).find({niveau: niveau}).toArray(function(err: any, result: any) {

            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.envoyerReponse(result[0].grille.replace('\\', ''));
            db.close();
        });
    }

    private procedureRappelInsererGrille(self: PersistenceGrillesService, db: any, grille: Grille) {
        let grilleStringify: string = JSON.stringify(grille);
        let grilleAInserer: Object = {
            id: Guid.generateGUID(),
            niveau: grille.obtenirNiveau(),
            grille: grilleStringify
        };

        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).insertOne(grilleAInserer, function(err: any, res: any) {
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.notifier();
            self.envoyerReponse('| 1 grille inséré');
            db.close();
        });
    }

    public insererPlusieursGrilles(grilles:Grille[]) {
        this.connectiondbMotsCroises(this.procedureRappelInsererplusieursGrilles, grilles);
    }

    private procedureRappelInsererplusieursGrilles(self: PersistenceGrillesService, db: any, grilles: Grille[]) {
        let grilleStringify: string;
        let grilleAInserer: Object;
        let grillesAInserer: Object[] = new Array();
        
        for(let grille of grilles) {
            grilleStringify = JSON.stringify(grille);
            grilleAInserer = {
                id: Guid.generateGUID(),
                niveau: grille.obtenirNiveau(),
                grille: grilleStringify
            };
            grillesAInserer.push(grilleAInserer);
        }

        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).insertMany(grillesAInserer, function(err: any, res: any) {
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.notifier();
            self.envoyerReponse(' | ' + res.insertedCount + ' grilles insérés');
            db.close();
        });

    }
    
    private verifierSierrConnection(err: any, db: any, self:PersistenceGrillesService): boolean {
        if(err) {
            db.close();
            self.reponse.send(err);
            return true;
        }
        
        return false;
    }
}

