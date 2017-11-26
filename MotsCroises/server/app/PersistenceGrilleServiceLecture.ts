import { nomTableauGrilles, PersistenceGrillesService } from './PersistenceGrillesService';
import { Niveau } from '../../commun/Niveau';
import { Grille } from './Grille';
import { FabriqueDeGrille } from './FabriqueDeGrille';

export class PersistenceGrilleServiceLecture {


    private asyncProcedureRappelObtenirGrille(self: PersistenceGrillesService, db: any, niveau: Niveau): Promise<Grille> {

        return new Promise(
            (resolve: any, reject: any) => {
                self.compteurRequetesEntiteePersistente++;
                db.collection(nomTableauGrilles).find({ niveau: niveau }).toArray((err: any, result: any) => {

                    self.notifierReponseRecuEntiteePersistente();
                    self.asyncVerifierSierrConnection(err, db, reject);
                    resolve(FabriqueDeGrille.creerInstanceAvecJSON(result[0].grille.replace('\\', '')));

                    self.supprimerGrille(self, db, result[0].id);
                    /*self.generateurDeGrilleService.genererGrilleMotSync(niveau).then((grille) => {
                        self.insererGrille(grille);
                        db.close();
                    });*/
                    self.insererGrille(self.generateurDeGrilleService.genererGrilleMotSync(niveau));
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
            self.supprimerGrille(self, db, result[0].id);
            /*self.generateurDeGrilleService.genererGrilleMotSync(niveau).then((grille) => {
                self.insererGrille(grille);
                db.close();
            });*/
            self.insererGrille(self.generateurDeGrilleService.genererGrilleMotSync(niveau));
            db.close();
        });
    }

    public obtenirGrillePersistante(persistenceGrilleService: PersistenceGrillesService, niveau: Niveau): void {
        persistenceGrilleService.connectiondbMotsCroises(this.procedureRappelObtenirGrille, niveau);
    }

    public asyncObtenirGrillePersistante(persistenceGrilleService: PersistenceGrillesService, niveau: Niveau): Promise<Grille> {

        return new Promise((resolve: any, reject: any) => {
            persistenceGrilleService.asyncConnectiondbMotsCroises(persistenceGrilleService)
                .then(db => this.asyncProcedureRappelObtenirGrille(persistenceGrilleService, db, niveau))
                .then(result => { resolve(result); })
                .catch(error => { reject(error); });
        });
    }
}
