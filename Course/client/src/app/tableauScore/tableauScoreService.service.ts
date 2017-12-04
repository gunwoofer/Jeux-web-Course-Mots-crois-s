import { NOMBRE_JOUEURS, FIN_PARTIE_URL } from './../constant';
import { TraitementDonneTableau } from './traitementDonneTableau';
import { Http, Response } from '@angular/http';
import { Score } from './score.model';
import { Piste } from '../piste/piste.model';
import { Injectable } from '@angular/core';
import 'rxjs/Rx';

@Injectable()

export class TableauScoreService {

    public piste: Piste;
    public temps: number;
    public finPartie: boolean;

    private tempsFinPartie: Score[];
    private traitementDonneeTableau = new TraitementDonneTableau();
    private debut = 0;

    constructor(private http: Http) {
        this.finPartie = false;
        this.tempsFinPartie = [];
    }

    public produireTableauResultat(): Score[] {
        if (!this.temps) { return; }

        for (let joueur = 0; joueur < NOMBRE_JOUEURS; joueur++) {
            this.gestionTempsFinPartie(joueur, this.temps);
        }

        return this.tempsFinPartie;
    }

    public mettreAjourTableauMeilleurTemps(score: Score): Promise<any> {
        this.ajouterTemps(score);
        return this.http.patch(FIN_PARTIE_URL + this.piste.id, this.piste)
                        .toPromise()
                        .then((reponse: Response) => reponse.json())
                        .catch(this.gererErreur);
    }

    private gererErreur(erreur: any): Promise<any> {
        console.error('Une erreur est arrivé', erreur);
        return Promise.reject(erreur.message || erreur);
    }

    private gestionTempsFinPartie(indice: number, temps: number): void {
        if (indice === 0) {
            this.tempsFinPartie.push(new Score('Joueur' + indice++, Math.floor(temps).toString(), indice++));
        } else {
            const number = Math.random() * (30 - indice) + 30;
            temps = temps + number;
            this.tempsFinPartie.push(new Score('Joueur' + indice++, Math.floor(temps).toString(), indice++));
        }
    }

    private ajouterTemps(score: Score): void {
        this.piste.meilleursTemps.push(score);
        const fin = this.piste.meilleursTemps.length - 1;
        this.traitementDonneeTableau.quickSort(this.piste.meilleursTemps, this.debut, fin);
        this.piste.meilleursTemps = this.traitementDonneeTableau.cinqMeilleurTemps(this.piste.meilleursTemps);
        this.temps = null;
    }
}
