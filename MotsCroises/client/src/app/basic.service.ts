import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Message } from '../../../commun/communication/message';

@Injectable()
export class BasicService {

  constructor(private http: Http) { }

  private url = 'http://localhost:3000/basic';
  private urlGrillePersistenteFacile = 'http://localhost:3000/grilles/persistence/grille/facile/async';
  private urlGrillePersistenteMoyen = 'http://localhost:3000/grilles/persistence/grille/moyen/async';
  private urlGrillePersistenteDifficile = 'http://localhost:3000/grilles/persistence/grille/difficile/async';
  private urlGrille = 'http://localhost:3000/GenerationDeGrilleService';
  private urlCreationGrilles = 'http://localhost:3000/grilles/persistence/grille/ajouter/5';


  public basicGet(): Promise<Message> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json() as Message)
      .catch(this.handleError);
  }

  public ajouterGrillesDeDepart() {
    this.http.get(this.urlCreationGrilles)
      .toPromise()
      .then(response => response.json() as string)
      .catch(this.handleError);
  }

  public obtenirGrille(): Promise<string> {
    return this.http.get(this.urlGrille)
      .toPromise()
      .then(response => response.json() as string)
      .catch(this.handleError);
  }

  public obtenirGrillePersistenteFacile(): Promise<string> {
    return this.http.get(this.urlGrillePersistenteFacile)
      .toPromise()
      .then(response => response.json() as string)
      .catch(this.handleError);
  }

  public obtenirGrillePersistenteMoyen(): Promise<string> {
    return this.http.get(this.urlGrillePersistenteMoyen)
      .toPromise()
      .then(response => response.json() as string)
      .catch(this.handleError);
  }

  public obtenirGrillePersistenteDifficile(): Promise<string> {
    return this.http.get(this.urlGrillePersistenteDifficile)
      .toPromise()
      .then(response => response.json() as string)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
