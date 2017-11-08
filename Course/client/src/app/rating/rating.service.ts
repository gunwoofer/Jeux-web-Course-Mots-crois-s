import { Piste } from '../piste/piste.model';
import { Injectable } from '@angular/core';


@Injectable()
export class RatingService {

    public piste: Piste;
    public rating: number;

    public ajouterMoyenne(): void {
        this.piste.coteAppreciation.push(this.rating);
    }

    public calculerLaMoyenneDeVotes(): number {
        let somme;
        const nombreElement = this.piste.coteAppreciation.length;
        for (let i = 0; i < this.piste.coteAppreciation.length; i++) {
            somme += this.piste.coteAppreciation[i];
        }
        const moyenne = somme / nombreElement;
        return moyenne;
    }
}
