import { Injectable } from '@angular/core';
import { Piste } from '../piste/piste.model';

@Injectable()
export class MondeDuJeuService {
    public piste: Piste;

    public ajouterPiste(piste: Piste): void {
        this.piste = piste;
    }

}
