import { Piste } from '../piste/piste.model';
import { Injectable } from '@angular/core';


@Injectable()
export class RatingService {

    public piste: Piste;
    public rating: number;

    public calculerLaMoyenneDeVotes(): void {
    }
}
