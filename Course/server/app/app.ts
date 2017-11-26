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
import { BdImplementation } from './bdImplementation';

import * as indexRoute from './routes/index';
import * as administrateurRoute from './routes/administrateur';
import * as configuration from './Configuration';

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

    const bd: BdImplementation = new BdImplementation();
    bd.connect(configuration.baseDeDonneesUrlLocal);
    //bd.connect(configuration.baseDeDonneesUrlExterne);


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
    const administrateur: administrateurRoute.Index = new administrateurRoute.Index();

    // admin
    router.patch('/ModifierPass', administrateur.modifierMotDePasse.bind(administrateur.modifierMotDePasse));
    router.post('/inscription', administrateur.ajouterAdmin.bind(administrateur.ajouterAdmin));
    router.post('/admin', administrateur.seConnecter.bind(administrateur.seConnecter));
    router.get('/admin', administrateur.retournerNombreAdmin.bind(administrateur.retournerNombreAdmin));
    router.get('/motDePasseOublie:email', administrateur.retournerMotDepasse.bind(administrateur.retournerMotDepasse));

    // pistes
    router.patch('/createurPiste:id', index.modifierPiste.bind(index.modifierPiste));
    router.patch('/finPartie:id', index.modifierTableauPiste.bind(index.modifierTableauPiste));
    router.patch('/resultatPartie:id', index.modifierRating.bind(index.modifierRating));
    router.delete('/listePiste:id', index.supprimerPiste.bind(index.supprimerPiste));
    router.get('/listePiste', index.retournerPiste.bind(index.retournerPiste));
    // createur de piste
    router.post('/createurPiste', index.ajouterPiste.bind(index.ajouterPiste));


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
