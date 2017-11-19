import * as express from 'express';
import { GenerateurDeGrilleServiceMock } from '../GenerateurDeGrilleServiceMock';
import { PersistenceGrillesService } from '../PersistenceGrillesService';
import { Grille } from '../Grille';
import { Niveau } from '../../../commun/Niveau';

module Route {

    export class Index {

        public GenerationDeGrilleService(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
            const grille: Grille = generateur.genererGrilleMock(Niveau.facile);

            res.send(JSON.stringify(grille));
        }

        public PersistenceGrillesService(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.insererPlusieursGrilles(generateur.obtenirGrillesBase(generateur));
        }

        public obtenirGrilleFacile(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.obtenirGrillePersistante(Niveau.facile);
        }

        public asyncObtenirGrilleFacile(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
            const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateur);

            persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.facile)
                .then(grille => { res.send(grille); })
                .catch(erreur => { throw new Error(erreur); });
        }

        public obtenirGrilleMoyen(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.obtenirGrillePersistante(Niveau.moyen);
        }

        public asyncObtenirGrilleMoyen(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
            const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateur);

            persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.moyen)
                .then(grille => { res.send(grille); })
                .catch(erreur => { throw new Error(erreur); });
        }

        public asyncObtenirGrilleDifficile(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
            const persistenceGrillesService: PersistenceGrillesService = new PersistenceGrillesService(generateur);

            persistenceGrillesService.asyncObtenirGrillePersistante(Niveau.difficile)
                .then(grille => { res.send(grille); })
                .catch(erreur => { throw new Error(erreur); });
        }

        public obtenirGrilleDifficile(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.obtenirGrillePersistante(Niveau.difficile);
        }
    }
}

export = Route;
