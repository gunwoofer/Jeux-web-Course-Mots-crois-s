import { TraitementDonneTableau } from './traitementDonneTableau';
import { Http, Response } from '@angular/http';
import { Score } from './score.model';
import { Piste } from '../piste/piste.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';


@Injectable()

export class TableauScoreService {

    public piste: Piste;
    public debut = 0;
    public temps: string;
    public traitementDonneeTableau= new TraitementDonneTableau();

    constructor(private http: Http) { }

    public verifierTemps(): boolean {
        let felicitation = false;
        if (this.temps) {
            const cinqMeilleurTemps: Score[] = this.traitementDonneeTableau.cinqMeilleurTemps(this.piste.meilleursTemps);


            if (cinqMeilleurTemps.length < 5) {
                felicitation = true;
            }

            if (cinqMeilleurTemps[0] !== undefined) {

                if (cinqMeilleurTemps[0].valeur > this.temps) {
                    felicitation = true;
                }

                if (cinqMeilleurTemps[cinqMeilleurTemps.length - 1].valeur > this.temps) {
                    felicitation = true;
                }

            }

            if (felicitation) {
                alert('BRAVO ! Vous êtes dans les cinq meilleurs scores !');
            }
        }
        return felicitation;
    }

    public ajouterTemps(score: Score): void {
        this.piste.meilleursTemps.push(score);
        const fin = this.piste.meilleursTemps.length - 1;
        this.traitementDonneeTableau.quickSort(this.piste.meilleursTemps, this.debut, fin);
        this.piste.meilleursTemps = this.traitementDonneeTableau.cinqMeilleurTemps(this.piste.meilleursTemps);
        this.temps = null;
    }

    public mettreAjourTableauMeilleurTemps(score: Score): Promise<any> {
        this.ajouterTemps(score);
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
