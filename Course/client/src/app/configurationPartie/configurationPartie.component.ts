import { NOMBRE_DE_TOURS_PARTIE_DEFAUT, NOMBRE_DE_TOURS_PARTIE_MINIMAL } from './../constant';
import { Piste } from './../piste/piste.model';
import { PisteService } from '../piste/piste.service';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-configurationpartie',
    templateUrl: './configurationPartie.component.html',
    styleUrls: ['./configurationPartie.component.css']
})

export class ConfigurationPartieComponent {

    public nombreDesTours = NOMBRE_DE_TOURS_PARTIE_MINIMAL;

    @Input() private piste: Piste;

    constructor(private pisteService: PisteService) { }

    public augmenterNombreTour(): void {
        if (this.nombreDesTours !== NOMBRE_DE_TOURS_PARTIE_DEFAUT) {
            this.nombreDesTours++;
        }
    }

    public diminuerNombreTour(): void {
        if (this.nombreDesTours !== NOMBRE_DE_TOURS_PARTIE_MINIMAL) {
            this.nombreDesTours--;
        }
    }

    public commencerPartie(): void {
        this.pisteService.commencerPartie(this.piste, this.nombreDesTours);
    }
}
