import * as express from 'express';
import { GenerateurDeGrilleService } from '../GenerateurDeGrilleService';
import { PersistenceGrillesService } from '../PersistenceGrillesService';
import { GenerateurDeMotContrainteService } from '../GenerateurDeMotContrainteService';
import { Grille, Niveau } from '../Grille';
import { Contrainte } from '../Contrainte';

module Route {

    export class Index {

        public GenerationDeGrilleService(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleService = new GenerateurDeGrilleService();
            const grille: Grille = generateur.genererGrille(Niveau.facile);

            res.send(JSON.stringify(grille));
        }

        public GenerationDeMotContrainteService(req: express.Request, res: express.Response, next: express.NextFunction): void {
            let contrainte1 = new Contrainte('h', 0);
            let contrainte2 = new Contrainte('e', 1);
            let nombreLettre: number = 5;
    
            const monGenerateurDeMot = new GenerateurDeMotContrainteService(nombreLettre, [contrainte1, contrainte2]);
            monGenerateurDeMot.genererMot(Niveau.facile).then((mot) => {
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
    }
}

export = Route;
