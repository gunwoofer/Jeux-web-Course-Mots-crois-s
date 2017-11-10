import { Http, Response } from '@angular/http';
import { Piste } from '../piste/piste.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';


@Injectable()
export class RatingService {

    public piste: Piste;

    constructor(private http: Http) { }

    public ajouterMoyenne(rating: number): void {
        this.piste.coteAppreciation.push(rating);
    }

    public mettreAjourRating(rating: number): Promise<any> {
        this.ajouterMoyenne(rating);
        return this.http.patch('http://localhost:3000/resultatPartie' + this.piste.id, this.piste)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    private gererErreur(erreur: any): Promise<any> {
        console.error('Une erreur est arrivé', erreur);
        return Promise.reject(erreur.message || erreur);
    }
}
