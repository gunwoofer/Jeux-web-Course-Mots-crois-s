let MongoClient = require('mongodb').MongoClient, assert = require('assert');

import { UUID } from './utilitaires/UUID';
import { Grille } from './Grille';
import * as express from 'express';


export const nomTableauGrilles:string = 'grilles';

// Connection URL
const url = 'mongodb://localhost:27017/motscroises';

export class PersistenceGrillesService {
    private reponse:  express.Response;
    private message: string = '';
    private compteurRequetesEntiteePersistente: number = 0;
    private pretPourEnvoyerReponse:boolean = false;

    constructor (reponse:  express.Response) {
        this.reponse = reponse;
    }

    public envoyerReponse(message: string){
        this.message += message;

        if(this.pretPourEnvoyerReponse) {
            this.reponse.send(this.message);
        }
    }

    public notifierReponseRecuEntiteePersistente() {
        this.compteurRequetesEntiteePersistente--;

        if(this.compteurRequetesEntiteePersistente === 0) {
            this.pretPourEnvoyerReponse = true;
        }
    }

    public connectiondbMotsCroises() {
        let self: PersistenceGrillesService = this;

       // Use connect method to connect to the server
       this.compteurRequetesEntiteePersistente++;
        MongoClient.connect(url, function(err: any, db: any) {    


            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
    
            self.envoyerReponse('Connexion avec succès à MongoDB');
            
            db.close();
        });
    }

    public creerTableauGrilles() {
        let self: PersistenceGrillesService = this;

        this.compteurRequetesEntiteePersistente++;
        MongoClient.connect(url, function(err: any, db: any) {     

            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);

            self.compteurRequetesEntiteePersistente++;
            db.createCollection(nomTableauGrilles, function(err: any, res: any) {
                
                self.notifierReponseRecuEntiteePersistente();
                self.verifierSierrConnection(err, db, self);

                self.envoyerReponse(' | Collection créé !');
                
                db.close();
            });
        });
    }

    public insererGrille(grille:Grille) {
        let self: PersistenceGrillesService = this;
        let grilleStringify: string = JSON.stringify(grille);
        let grilleAInserer: Object = {
            id: UUID.generateUUID(),
            niveau: grille.obtenirNiveau(),
            grille: grilleStringify
        };

        this.compteurRequetesEntiteePersistente++;
        MongoClient.connect(url, function(err: any, db: any) {

            self.notifierReponseRecuEntiteePersistente();
            self.verifierSierrConnection(err, db, self);
            
            self.compteurRequetesEntiteePersistente++;
            db.collection(nomTableauGrilles).insertOne(grilleAInserer, function(err: any, res: any) {
    
                self.notifierReponseRecuEntiteePersistente();
                self.verifierSierrConnection(err, db, self);
                self.envoyerReponse('| 1 document inserted');
                db.close();
            });
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

