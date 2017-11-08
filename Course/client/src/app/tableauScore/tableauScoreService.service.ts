import { TraitementDonneTableau } from './traitementDonneTableau';
import { Http, Response } from '@angular/http';
import { Score } from './Score.model';
import { Piste } from '../piste/piste.model';
import { Injectable } from '@angular/core';

@Injectable()

export class TableauScoreService {

    public piste: Piste;
    public debut = 0;
    public temps: string;
    public traitementDonneeTableau= new TraitementDonneTableau();

    constructor(private http: Http) { }

    public ajouterTemps(score: Score): void {
        this.piste.meilleursTemps.push(score);
        const fin = this.piste.meilleursTemps.length - 1;
        this.traitementDonneeTableau.quickSort(this.piste.meilleursTemps, this.debut, fin);
        this.piste.meilleursTemps = this.traitementDonneeTableau.cinqMeilleurTemps(this.piste.meilleursTemps);
        this.temps = null;
    }

    public mettreAjourTableauMeilleurTemps(score: Score): Promise<JSON> {
        this.ajouterTemps(score);
        console.log(this.piste.id);
        return this.http.patch('http://localhost:3000/finPartie' + this.piste.id, this.piste)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    private gererErreur(erreur: any): Promise<any> {
        console.error('Une erreur est arrivé', erreur);
        return Promise.reject(erreur.message || erreur);
    }
}
