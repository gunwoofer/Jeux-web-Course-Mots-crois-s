import * as express from 'express';
import { GenerateurDeGrilleService } from '../GenerateurDeGrilleService';
import { PersistenceGrillesService } from '../PersistenceGrillesService';
import { GenerateurDeMotContrainteService } from '../GenerateurDeMotContrainteService';
import { Grille } from '../Grille';
import { Niveau } from '../../../commun/Niveau';
import { GestionnaireDePartieService } from '../GestionnaireDePartieService';
import { TypePartie } from '../Partie';
import { Joueur } from '../../../commun/Joueur';
import { EmplacementMot } from '../EmplacementMot';
import { Case } from '../Case';

module Route {

    export class Index {

        public GenerationDeGrilleService(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const grille: Grille = generateur.genererGrille(Niveau.facile);

            res.send(JSON.stringify(grille));
        }

        public GenererMotAleatoireFacile(req: express.Request, res: express.Response, next: express.NextFunction): void {
             const nombreLettre = 5;

            const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
            monGenerateurDeMot.genererMotAleatoire(Niveau.facile).then((mot) => {
                res.send(JSON.stringify(mot));
            });
        }
        
        public GenererMotAleatoireMoyen(req: express.Request, res: express.Response, next: express.NextFunction): void {
                const nombreLettre = 5;

            const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
            monGenerateurDeMot.genererMotAleatoire(Niveau.moyen).then((mot) => {
                res.send(JSON.stringify(mot));
            });
        }
        
        public GenererMotAleatoireDifficile(req: express.Request, res: express.Response, next: express.NextFunction): void {
                const nombreLettre = 5;

            const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre);
            monGenerateurDeMot.genererMotAleatoire(Niveau.difficile).then((mot) => {
                res.send(JSON.stringify(mot));
            });
        }

        public PersistenceGrillesService(req: express.Request, res: express.Response, next: express.NextFunction): void {

            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.insererPlusieursGrilles(generateur.obtenirGrillesBase(generateur));

        }

        public asyncPersistenceGrillesService(req: express.Request, res: express.Response, next: express.NextFunction): void {

            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);
            const grilles: Grille[] = generateur.obtenirGrillesBase(generateur);

            persistenceGrilles.asyncInsererPlusieursGrilles(grilles)
                .then(resultat => { res.send(resultat) })
                .catch(erreur => { throw new Error(erreur); });

        }

        public obtenirGrilleFacile(req: express.Request, res: express.Response, next: express.NextFunction): void {

            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.obtenirGrillePersistante(Niveau.facile);
        }

        public asyncObtenirGrilleFacile(req: express.Request, res: express.Response, next: express.NextFunction): void {

            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateur);

            persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.facile)
                .then(grille => { res.send(grille) })
                .catch(erreur => { throw new Error(erreur); });

        }

        public asyncObtenirGrilleMoyen(req: express.Request, res: express.Response, next: express.NextFunction): void {

            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateur);

            persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.moyen)
                .then(grille => { res.send(grille) })
                .catch(erreur => { throw new Error(erreur); });

        }

        public asyncObtenirGrilleDifficile(req: express.Request, res: express.Response, next: express.NextFunction): void {

            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateur);

            persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.difficile)
                .then(grille => { res.send(grille) })
                .catch(erreur => { throw new Error(erreur); });

        }

        public creerTableauGrille(req: express.Request, res: express.Response, next: express.NextFunction): void {

            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.creerTableauGrilles();

        }

        public obtenirGrilleMoyen(req: express.Request, res: express.Response, next: express.NextFunction): void {

            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.obtenirGrillePersistante(Niveau.moyen);
        }

        public obtenirGrilleDifficile(req: express.Request, res: express.Response, next: express.NextFunction): void {

            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.obtenirGrillePersistante(Niveau.difficile);
        }


        public verifierMauvaisMot(req: express.Request, res: express.Response, next: express.NextFunction): void {

            const joueur: Joueur = new Joueur();
            const typePartie: TypePartie = TypePartie.dynamique;
            const generateurDeGrilleService:GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateurDeGrilleService);
            const gestionniareDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
            let guidPartie = '';
    
            persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.facile)
                .then((grilleDepart: Grille)=>{
                    guidPartie = gestionniareDePartieService.creerPartie(joueur, typePartie, grilleDepart, Niveau.facile);
                    const emplacementsMot: EmplacementMot[] = grilleDepart.emplacementsHorizontaux();
                    const emplacementMot: EmplacementMot = emplacementsMot[0];
                    const caseDebut: Case = emplacementMot.obtenirCaseDebut();
                    const caseFin: Case = emplacementMot.obtenirCaseFin();
                    const longueurMot: number = emplacementMot.obtenirGrandeur();
                    let motAVerifier: string;
    
                    for(let i = 0; i < longueurMot; i++) {
                        motAVerifier += 'a';
                    }
    
                    res.send(!gestionniareDePartieService.estLeMot(caseDebut, caseFin, motAVerifier, guidPartie, joueur.obtenirGuid()));
                })
                .catch((erreur) => {
                    console.log(erreur);
                });

        }
    }
}

export = Route;
