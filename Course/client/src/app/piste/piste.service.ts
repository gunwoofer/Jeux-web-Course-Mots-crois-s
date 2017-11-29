import { NOMBRE_DE_TOURS_PAR_DEFAULT } from './../constant';
import { RatingService } from './../rating/rating.service';
import { Http, Response } from '@angular/http';
import { Piste } from './piste.model';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { GenerateurPisteService } from '../generateurPiste/generateurpiste.service';
import { ElementDePiste } from '../elementsPiste/ElementDePiste';

@Injectable()

export class PisteService {
    private pistes: Piste[] = [];
    public pisteAEditer = new EventEmitter<Piste>();
    public pisteChoisie = new EventEmitter<Piste>();
    public tableauMeilleurTemps = new EventEmitter<Piste>();
    public nombreDeTours = NOMBRE_DE_TOURS_PAR_DEFAULT;

    constructor(private generateurPisteService: GenerateurPisteService, private http: Http, private ratingService: RatingService) {

        this.pisteChoisie.subscribe(
            (piste: Piste) => {
                this.generateurPisteService.ajouterPiste(piste);
                this.ratingService.piste = piste;
            }
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
                    const pist = new Piste(piste.nom,
                        piste.typeCourse,
                        piste.description,
                        piste.listepositions,
                        piste.listeElementsDePiste,
                        piste._id);
                    pist.modifieAttribut(piste.coteAppreciation, piste.nombreFoisJouee, piste.meilleursTemps, piste.vignette);
                    pist.calculerLaMoyenneDeVotes(piste.coteAppreciation);
                    const elementDePiste = pist.listeElementsDePiste;
                    console.log(elementDePiste);
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

    public commencerPartie(piste: Piste, nombreTours: number) {
        this.nombreDeTours = nombreTours;
        this.pisteChoisie.emit(piste);
    }


    public mettreAjourPiste(piste: Piste): Promise<JSON> {
        return this.http.patch('http://localhost:3000/createurPiste' + piste.id, piste)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }
}
