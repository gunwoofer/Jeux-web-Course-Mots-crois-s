import { Http, Headers, Response } from '@angular/http';
import { Piste } from './piste.model';
import { Injectable, EventEmitter } from '@angular/core';
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

    public retournerListePiste(): Promise<any> {
        return this.http.get('http://localhost:3000/listePiste')
            .toPromise()
            .then(response => {
                const pistes = response.json().obj;
                const pisteTemporaire: Piste[] = [];
                for (const piste of pistes) {
                    const pist = new Piste(piste.nom, piste.typeCourse, piste.description, piste.listepositions, piste._id);
                    pist.modifieAttribut(piste.coteAppreciation, piste.nombreFoisJouee, piste.meilleursTemps);
                    pisteTemporaire.push(pist);
                }
                this.pistes = pisteTemporaire;
                return pisteTemporaire;
            });
    }

    public supprimerListePiste(piste: Piste): Promise<JSON> {
        const pist = piste.id;
        console.log(pist);
        this.pistes.splice(this.pistes.indexOf(piste), 1);
        return this.http.delete('http://localhost:3000/listePiste' + pist)
            .toPromise()
            .then(response => response.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public modifierPiste(piste: Piste): void {
        this.pisteAEditer.emit(piste);
    }

    public commencerPartie(piste: Piste): void {
        console.log(piste);
    }

    public mettreAjourPiste(piste: Piste): Observable<JSON> {
        return this.http.patch('http://localhost:3000/createurPiste' + piste.id, piste)
            .map((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }
}
