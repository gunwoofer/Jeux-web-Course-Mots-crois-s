import { NOMBRE_DE_TOURS_PAR_DEFAULT, NOMBRE_DE_TOURS_PAR_MINIMAL } from './../constant';
import { Piste } from './../piste/piste.model';
import { PisteService } from '../piste/piste.service';
import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-configurationpartie',
    templateUrl: './configurationPartie.component.html',
    styleUrls: ['./configurationPartie.component.css']
})

export class ConfigurationPartieComponent {

    @Input() private piste: Piste;
    public nombreDesTours = NOMBRE_DE_TOURS_PAR_MINIMAL;

    constructor(private pisteService: PisteService) { }

    public augmenterNombreTour(): void {
        if (this.nombreDesTours !== NOMBRE_DE_TOURS_PAR_DEFAULT) {
            this.nombreDesTours++;
        }
    }

    public diminuerNombreTour(): void {
        if (this.nombreDesTours !== NOMBRE_DE_TOURS_PAR_MINIMAL) {
            this.nombreDesTours--;
        }
    }

    public commencerPartie(): void {
        this.pisteService.commencerPartie(this.piste, this.nombreDesTours);
    }
}
