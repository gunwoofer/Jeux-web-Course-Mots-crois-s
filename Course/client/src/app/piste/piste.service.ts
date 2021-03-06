import { MondeDuJeuService } from './../mondedujeu/mondedujeu.service';
import { FabriquantElementDePiste } from './../elementsPiste/FabriquantElementDePiste';
import { NOMBRE_DE_TOURS_PARTIE_DEFAUT, CREATEUR_PISTE_URL, LISTE_PISTE_URL } from './../constant';
import { RatingService } from './../rating/rating.service';
import { Http, Response } from '@angular/http';
import { Piste } from './piste.model';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

import { ElementDePiste } from '../elementsPiste/ElementDePiste';

@Injectable()

export class PisteService {
    private pistes: Piste[] = [];
    public pisteAEditer = new EventEmitter<Piste>();
    public pisteChoisie = new EventEmitter<Piste>();
    public tableauMeilleurTemps = new EventEmitter<Piste>();
    public nombreDeTours = NOMBRE_DE_TOURS_PARTIE_DEFAUT;

    constructor(private mondeDuJeuService: MondeDuJeuService,
                private http: Http,
                private ratingService: RatingService) {

        this.pisteChoisie.subscribe(
            (piste: Piste) => {
                this.mondeDuJeuService.ajouterPiste(piste);
                this.ratingService.piste = piste;
            }
        );
    }


    public ajouterPiste(piste: Piste): Promise<Response> {
        this.pistes.push(piste);
        return this.http.post(CREATEUR_PISTE_URL, piste)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }

    public retournerListePiste(): Promise<Piste[]> {
        return this.http.get(LISTE_PISTE_URL)
            .toPromise()
            .then(response => {
                const pistes = response.json().obj;
                const pisteTemporaire: Piste[] = [];
                for (const piste of pistes) {
                    const listeElements: ElementDePiste[] = new Array();
                    for (let i = 0; i < piste.listeElementsDePiste.length; i++) {
                        listeElements.push(FabriquantElementDePiste.rehydrater(piste.listeElementsDePiste[i], piste.listepositions));
                    }
                    const pist = new Piste(piste.nom,
                        piste.typeCourse,
                        piste.description,
                        piste.listepositions,
                        listeElements,
                        piste._id);
                    pist.modifieAttribut(piste.coteAppreciation, piste.nombreFoisJouee, piste.meilleursTemps, piste.vignette);
                    pist.calculerLaMoyenneDeVotes(piste.coteAppreciation);
                    pisteTemporaire.push(pist);
                }
                this.pistes = pisteTemporaire;
                return pisteTemporaire;
            });
    }

    public supprimerListePiste(piste: Piste): Promise<JSON> {
        const pist = piste.id;
        this.pistes.splice(this.pistes.indexOf(piste), 1);
        return this.http.delete(LISTE_PISTE_URL + pist)
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
        return this.http.patch(CREATEUR_PISTE_URL + piste.id, piste)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch((erreur: Response) => Observable.throw(erreur.json()));
    }
}
