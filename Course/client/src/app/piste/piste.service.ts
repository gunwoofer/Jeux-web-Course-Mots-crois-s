import { toPromise } from 'rxjs/operator/toPromise';
import { Http, Response } from '@angular/http';
import { Piste } from './piste.model';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { GenerateurPisteService } from '../generateurPiste/generateurpiste.service';

@Injectable()

export class PisteService {
    private pistes: Piste[] = [];
    public pisteAEditer = new EventEmitter<Piste>();
    public pisteChoisie = new EventEmitter<Piste>();

    constructor(generateurPisteService: GenerateurPisteService, private http: Http) {

        this.pisteChoisie.subscribe(
            (piste: Piste) => generateurPisteService.ajouterPiste(piste)
        );
    }


    public ajouterPiste(piste: Piste): Promise<Response> {
        this.pistes.push(piste);
        return this.http.post('http://localhost:3000/createurPiste', piste)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public retournerListePiste(): Promise<Piste[]> {
        return this.http.get('http://localhost:3000/listePiste')
            .toPromise()
            .then(response => {
                const pistes = response.json().obj;
                const pisteTemporaire: Piste[] = [];
                for (const piste of pistes) {
                    const pist = new Piste(piste.nom, piste.typeCourse, piste.description, piste.listepositions, piste._id);
                    // pist.miseAjourSegmentsdePiste();
                    pist.modifieAttribut(piste.coteAppreciation, piste.nombreFoisJouee, piste.meilleursTemps, piste.vignette);
                    pisteTemporaire.push(pist);
                }
                this.pistes = pisteTemporaire;
                return pisteTemporaire;
            });
    }

    public supprimerListePiste(piste: Piste): Promise<JSON> {
        const pist = piste.id;
        this.pistes.splice(this.pistes.indexOf(piste), 1);
        return this.http.delete('http://localhost:3000/listePiste' + pist)
            .toPromise()
            .then(response => response.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public modifierPiste(piste: Piste): void {
        this.pisteAEditer.emit(piste);
    }

    public commencerPartie(piste: Piste) {
        this.pisteChoisie.emit(piste);
    }


    public mettreAjourPiste(piste: Piste): Promise<JSON> {
        return this.http.patch('http://localhost:3000/createurPiste' + piste.id, piste)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }
}
