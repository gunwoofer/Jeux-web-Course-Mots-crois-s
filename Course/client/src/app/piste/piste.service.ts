import { Http } from '@angular/http';
import { Piste } from './piste.model';
import { Injectable } from '@angular/core';

import { RenderService } from '../renderService/render.service';

@Injectable()

export class PisteService {
    private pistes: Piste[] = [];

    constructor(private renderService: RenderService, private http: Http) {}

    public ajouterPiste(piste: Piste) {
        this.pistes.push(piste);
        const donnee = JSON.stringify(piste);
        this.http.post('http://localhost:3000/createurPiste', donnee);
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
