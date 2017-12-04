import { MESSAGE_ERREUR, RESULTAT_PARTIE_URL } from './../constant';
import { Http, Response } from '@angular/http';
import { Piste } from '../piste/piste.model';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';


@Injectable()
export class RatingService {

    public piste: Piste;

    constructor(private http: Http) { }

    public mettreAjourRating(rating: number): Promise<any> {
        this.ajouterMoyenne(rating);

        this.piste.supprimerMesh();
        return this.http.patch(RESULTAT_PARTIE_URL + this.piste.id, this.piste)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    private gererErreur(erreur: any): Promise<any> {
        console.error(MESSAGE_ERREUR, erreur);
        return Promise.reject(erreur.message || erreur);
    }

    private ajouterMoyenne(rating: number): void {
        this.piste.coteAppreciation.push(rating);
    }
}
