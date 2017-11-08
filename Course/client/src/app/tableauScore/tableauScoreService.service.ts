import { Score } from './Score.model';
import { Piste } from '../piste/piste.model';
import { Injectable } from '@angular/core';

@Injectable()

export class TableauScoreService {

    public piste: Piste;
    public debut = 0;
    public temps: string;

    public ajouterTemps(score: Score): void {
        this.piste.meilleursTemps.push(score);
        const fin = this.piste.meilleursTemps.length - 1;
        this.quickSort(this.piste.meilleursTemps, this.debut, fin);
        console.log(this.piste.meilleursTemps);
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

    public cinqMeilleurTemps(): void {
        this.piste.meilleursTemps.slice(1, 5);
        this.donnerUnRang();
    }

    public donnerUnRang(): void {
        for (let i = 0; i < this.piste.meilleursTemps.length; i++) {
            this.piste.meilleursTemps[i].position = i;
        }
    }
}
