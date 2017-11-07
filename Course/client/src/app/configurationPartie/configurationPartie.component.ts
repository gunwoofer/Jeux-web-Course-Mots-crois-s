import { Piste } from './../piste/piste.model';
import { PisteService } from '../piste/piste.service';
import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-configurationpartie',
    templateUrl: './configurationPartie.component.html',
    styleUrls: ['./configurationPartie.component.css']
})

export class ConfigurationPartieComponent {

    @Input() private piste: Piste;
    private nombreDesTours = 1;

    constructor(private router: Router, private tableauScoreService: TableauScoreService,
        private pisteService: PisteService) { }

    public augmenterNombreTour(): void {
        if (this.nombreDesTours !== 3) {
            this.nombreDesTours++;
        }
    }

    public diminuerNombreTour(): void {
        if (this.nombreDesTours !== 1) {
            this.nombreDesTours--;
        }
    }

    public commencerPartie(): void {
        this.pisteService.commencerPartie(this.piste);
    }
}
