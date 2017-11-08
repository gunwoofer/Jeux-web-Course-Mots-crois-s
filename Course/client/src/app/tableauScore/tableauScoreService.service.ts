import { Http, Response } from '@angular/http';
import { Score } from './Score.model';
import { Piste } from '../piste/piste.model';
import { Injectable } from '@angular/core';

@Injectable()

export class TableauScoreService {

    public piste: Piste;
    public debut = 0;
    public temps: string;

    constructor(private http: Http) { }

    public ajouterTemps(score: Score): void {
        this.piste.meilleursTemps.push(score);
        const fin = this.piste.meilleursTemps.length - 1;
        this.quickSort(this.piste.meilleursTemps, this.debut, fin);
        this.piste.meilleursTemps = this.cinqMeilleurTemps(this.piste.meilleursTemps);
    }

    public mettreAjourTableauMeilleurTemps(score: Score): Promise<JSON> {
        this.ajouterTemps(score);
        console.log(this.piste.id);
        return this.http.patch('http://localhost:3000/finPartie' + this.piste.id, this.piste)
            .toPromise()
            .then((reponse: Response) => reponse.json())
            .catch(this.gererErreur);
    }

    public echanger(chiffresTab: Score[], score: number, score2: number): void {
        const temp = chiffresTab[score];
        chiffresTab[score] = chiffresTab[score2];
        chiffresTab[score2] = temp;
    }

    public partition(chiffresTab: Score[], debut: number, fin: number): number {
        const pivot = chiffresTab[fin].valeur;
        let indexPartition = debut;
        for (let i = debut; i < fin; i++) {
            if (chiffresTab[i].valeur <= pivot) {
                this.echanger(chiffresTab, i, indexPartition);
                indexPartition++;
            }
        }
        this.echanger(chiffresTab, indexPartition, fin);
        return indexPartition;
    }

    public quickSort(chiffresTab: Score[], debut: number, fin: number): void {
        if (debut < fin) {
            const indexPartition = this.partition(chiffresTab, debut, fin);
            this.quickSort(chiffresTab, debut, indexPartition - 1);
            this.quickSort(chiffresTab, indexPartition + 1, fin);
        }
    }

    public cinqMeilleurTemps(temps: Score[]): Score[] {
        temps = temps.slice(0, 5);
        this.donnerUnRang(temps);
        return temps;
    }

    public donnerUnRang(temps: Score[]): void {
        for (let i = 0; i < temps.length; i++) {
            temps[i].position = i + 1;
        }
    }

    private gererErreur(erreur: any): Promise<any> {
        console.error('Une erreur est arrivé', erreur);
        return Promise.reject(erreur.message || erreur);
    }
}
