import { Http, Headers, Response } from '@angular/http';
import { Piste } from './piste.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { RenderService } from '../renderService/render.service';

import 'rxjs/Rx';

@Injectable()

export class PisteService {
    private pistes: Piste[] = [];
    public pisteAEditer = new EventEmitter<Piste>();

    constructor(private renderService: RenderService, private http: Http) { }

    public ajouterPiste(piste: Piste): Observable<Response> {
        this.pistes.push(piste);
        return this.http.post('http://localhost:3000/createurPiste', piste)
            .map((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public retournerListePiste() {
        return this.http.get('http://localhost:3000/listePiste')
            .toPromise()
            .then(response => response.json().obj);
    }

    public supprimerListePiste(piste: Piste) {
        this.pistes.splice(this.pistes.indexOf(piste));
    }

    public modifierPiste(piste: Piste) {
        this.pisteAEditer.emit(piste);
    }

}
