import { Guid } from './Guid';
import { Grille, Niveau } from './Grille';
import * as express from 'express';
import { Observateur } from './Observateur';
import { BDImplementation } from './BDImplementation';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';


export const nomTableauGrilles:string = 'grilles';

// Connection URL
const url = 'mongodb://localhost:27017/motscroises';

export class PersistenceGrillesService {
    private reponse:  express.Response;
    public message: string = '';
    private compteurRequetesEntiteePersistente: number = 0;
    private pretPourEnvoyerReponse:boolean = false;
    private observateurs: Observateur[] = new Array();
    private generateurDeGrilleService:GenerateurDeGrilleService;
    private aEteEnvoye:boolean = false;

    private bdImplementation:BDImplementation = new BDImplementation();

    constructor (generateurDeGrilleService: GenerateurDeGrilleService, reponse?:  express.Response) {
        this.generateurDeGrilleService = generateurDeGrilleService;
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

        if(this.pretPourEnvoyerReponse && this.reponse !== undefined && (!this.aEteEnvoye)) {
            this.reponse.send(this.message);
            this.aEteEnvoye = true;
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
       this.bdImplementation.seConnecter(url, function(err: any, db: any) {   

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

    private supprimerGrille(self:PersistenceGrillesService,db:any, id:string) {
        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).deleteOne({id:id}, function(err: any, obj: any) {
            
            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.notifier();

            db.close();
        });
    }

    public insererGrille(grille:Grille) {
        this.connectiondbMotsCroises(this.procedureRappelInsererGrille, grille);
    }

    public obtenirGrillePersistante(niveau: Niveau) {
        this.connectiondbMotsCroises(this.procedureRappelObtenirGrille, niveau);
    }
    
    public asyncObtenirGrillePersistante(niveau: Niveau): Promise<Grille> {
        let self: PersistenceGrillesService = this;

       return new Promise(function(resolve: any, reject: any){ 
           self.asyncConnectiondbMotsCroises(self)
                    .then(db => self.asyncProcedureRappelObtenirGrille(self, db, niveau))
                    .then(result => {resolve(result)})
                    .catch(error => { reject(error); });
       });
    }

    public asyncConnectiondbMotsCroises(self: PersistenceGrillesService): Promise<any> {
        return new Promise(function(resolve: any, reject: any){
            // Connexion à la base de données persistente.
            self.compteurRequetesEntiteePersistente++;
            self.bdImplementation.seConnecter(url, function(err: any, db: any) {   

                self.notifierReponseRecuEntiteePersistente();
                self.asyncVerifierSierrConnection(err, db, reject);

                resolve(db);
            });
        });
    }

    private asyncVerifierSierrConnection(err: any, db: any, reject: any): boolean {
            if(err) {
                reject(err);
                db.close();
                return true;
            }
            
            return false;
    }
    
    private asyncProcedureRappelObtenirGrille(self:PersistenceGrillesService, db: any, niveau: Niveau): Promise<Grille> {

        return new Promise( 
            function(resolve: any, reject: any)
            {                
                self.compteurRequetesEntiteePersistente++;
                db.collection(nomTableauGrilles).find({niveau: niveau}).toArray(function(err: any, result: any) {

                    self.notifierReponseRecuEntiteePersistente();
                    self.asyncVerifierSierrConnection(err, db, reject);
                    resolve(result[0].grille.replace('\\', ''));
                    self.notifier();

                    self.supprimerGrille(self, db, result[0].id);
                    self.insererGrille(self.generateurDeGrilleService.genererGrille(niveau));
                    db.close();
                });
            }
        );
    }

    private procedureRappelObtenirGrille(self: PersistenceGrillesService, db: any, niveau: Niveau) {

        self.compteurRequetesEntiteePersistente++;
        db.collection(nomTableauGrilles).find({niveau: niveau}).toArray(function(err: any, result: any) {

            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            self.envoyerReponse(result[0].grille.replace('\\', ''));
            self.notifier();

            self.supprimerGrille(self, db, result[0].id);
            self.insererGrille(self.generateurDeGrilleService.genererGrille(niveau));
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

    public insererPlusieursGrilles(grilles: Grille[]) {
        this.connectiondbMotsCroises(this.procedureRappelInsererplusieursGrilles, grilles);
    }

    public asyncInsererPlusieursGrilles(grilles: Grille[]): Promise<string> {

        let self: PersistenceGrillesService = this;
        
        return new Promise(function(resolve: any, reject: any){ 
            self.asyncConnectiondbMotsCroises(self)
                    .then(db => self.asyncProcedureRappelInsererplusieursGrilles(self, db, grilles))
                    .then(result => {resolve(result)})
                    .catch(error => { reject(error); });
        });
    }
    
    private asyncProcedureRappelInsererplusieursGrilles(self: PersistenceGrillesService, db: any, grilles: Grille[]): Promise<string> {
        

        return new Promise( 
            function(resolve: any, reject: any)
            {    
                
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
                    self.asyncVerifierSierrConnection(err, db, self);
                    self.notifier();
                    resolve(' | ' + res.insertedCount + ' grilles insérés (async)');
                    db.close();
                });
            }
        );
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

