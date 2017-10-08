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
            .then(response => {
                const pistes = response.json().obj;
                const pisteTemporaire: Piste[] = [];
                for (const piste of pistes) {
                    const pist = new Piste(piste.nom, piste.typeCourse, piste.description, piste.listepositions, piste._id);
                    pist.coteAppreciation = piste.coteAppreciation;
                    pist.nombreFoisJouee = piste.nombreFoisJouee;
                    pist.meilleursTemps = piste.meilleursTemps;
                    pisteTemporaire.push(pist);
                }
                this.pistes = pisteTemporaire;
                return pisteTemporaire;
            });
    }

    public supprimerListePiste(piste: Piste) {
        this.pistes.splice(this.pistes.indexOf(piste), 1);
        return this.http.delete('http://localhost:3000/listePiste/' + piste.id)
            .toPromise()
            .then(response => response.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public modifierPiste(piste: Piste) {
        this.pisteAEditer.emit(piste);
    }

}
