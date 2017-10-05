import { Piste } from './piste.model';
import { Injectable } from '@angular/core';

import { RenderService } from '../renderService/render.service';

@Injectable()

export class PisteService {
    private pistes: Piste[] = [];

    constructor(private renderService: RenderService) {}

    public ajouterPiste(piste: Piste) {
        this.pistes.push(piste);
    }

    public retournerListePiste() {
        return this.pistes;
    }

    public supprimerListePiste(piste: Piste) {
        this.pistes.splice(this.pistes.indexOf(piste));
    }

    public modifierPiste(piste: Piste) {
       // this.renderService.chargerPiste(piste);
    }

}
