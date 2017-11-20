import * as express from 'express';
import { GenerateurDeGrilleServiceMock } from '../GenerateurDeGrilleServiceMock';
import { PersistenceGrillesService } from '../PersistenceGrillesService';
import { Grille } from '../Grille';
import { Niveau } from '../../../commun/Niveau';
import { Case, EtatCase } from '../../../commun/Case';
import { GenerateurDeGrilleService } from '../GenerateurDeGrilleService';

module Route {

    export class Index {

        public testGenerationGrille(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateurDeGrilleService = new GenerateurDeGrilleService();
            const grille: Grille = generateurDeGrilleService.genereGrilleVide(Niveau.facile);
            for (let i = 0; i < 10; i++) {
                let ligne: string;
                ligne = '';
                for (let j = 0; j < 10; j++) {
                    const caseGrille: Case = grille.cases[i][j];
                    if (caseGrille.etat === EtatCase.noir) {
                        ligne += '#';
                    } else {
                        ligne += '.';
                    }
                }
                console.log(ligne);
            }
        }

        public GenerationDeGrilleService(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
            const grille: Grille = generateur.genererGrilleMock(Niveau.facile);

            res.send(JSON.stringify(grille));
        }

        public PersistenceGrillesService(req: express.Request, res: express.Response, next: express.NextFunction): void {
            const generateur: GenerateurDeGrilleServiceMock = new GenerateurDeGrilleServiceMock();
            const persistenceGrilles: PersistenceGrillesService = new PersistenceGrillesService(generateur, res);

            persistenceGrilles.insererPlusieursGrilles(generateur.obtenirGrillesBase());
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
