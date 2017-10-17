/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import * as indexRoute from './routes/index';
import { ConnexionTempsReelServer } from './ConnexionTempsReelServer';


export class Application {

    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this this.app.
     */
    public static bootstrap(): Application {
        return new Application();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        // Application instantiation
        this.app = express();

        // configure this.application
        this.config();

        // configure routes
        this.routes();
    }

    /**
     * The config function.
     *
     * @class Server
     * @method config
     */
    private config() {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../client')));
        this.app.use(cors());
    }

    /**
     * The routes function.
     *
     * @class Server
     * @method routes
     */
    public routes() {
        let router: express.Router;
        router = express.Router();

        // create routes
        const index: indexRoute.Index = new indexRoute.Index();

        // Generation d'une grille
        router.get('/GenerationDeGrilleService', index.GenerationDeGrilleService.bind(index.GenerationDeGrilleService));

        // Utilisation de la base de données.
        router.use('/grilles/persistence/grille/facile/async', index.asyncObtenirGrilleFacile.bind(index.asyncObtenirGrilleFacile));
        router.use('/grilles/persistence/grille/facile', index.obtenirGrilleFacile.bind(index.obtenirGrilleFacile));
        router.use('/grilles/persistence/grille/moyen/async', index.asyncObtenirGrilleMoyen.bind(index.asyncObtenirGrilleMoyen));
        router.use('/grilles/persistence/grille/moyen', index.obtenirGrilleMoyen.bind(index.obtenirGrilleMoyen));
        router.use('/grilles/persistence/grille/difficile/async',
            index.asyncObtenirGrilleDifficile.bind(index.asyncObtenirGrilleDifficile));
        router.use('/grilles/persistence/grille/difficile', index.obtenirGrilleDifficile.bind(index.obtenirGrilleDifficile));

        router.use('/grilles/persistence/grille/ajouter/5/async',
            index.asyncPersistenceGrillesService.bind(index.asyncPersistenceGrillesService));
        router.use('/grilles/persistence/grille/ajouter/15', index.PersistenceGrillesService.bind(index.PersistenceGrillesService));
        router.use('/grilles/tableau/creer', index.creerTableauGrille.bind(index.creerTableauGrille));

        // Generation De mot
        router.use('/mot/creer/facile', index.GenererMotAleatoireFacile.bind(index.GenererMotAleatoireFacile));
        router.use('/mot/creer/moyen', index.GenererMotAleatoireMoyen.bind(index.GenererMotAleatoireMoyen));
        router.use('/mot/creer/difficile', index.GenererMotAleatoireDifficile.bind(index.GenererMotAleatoireDifficile));

        // partie
        router.use('/partie/test/verifier/mot', index.verifierMauvaisMot.bind(index.verifierMauvaisMot));



        // Socket IO
        const connexionTempsReelServer: ConnexionTempsReelServer = new ConnexionTempsReelServer(this.app);
        console.log('partir écoute ...');
        connexionTempsReelServer.ecouterPourConnexionClients();

        // use router middleware
        this.app.use(router);

        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || 500);
                res.send({
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }
}
