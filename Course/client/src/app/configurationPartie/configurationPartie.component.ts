import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
import { Router } from '@angular/router';
import { Component, Input } from '@angular/core';


@Component({
    selector: 'app-configurationpartie',
    templateUrl: './configurationPartie.component.html',
    styleUrls: ['./configurationPartie.component.css']
})

export class ConfigurationPartieComponent {
    private nombreDesTours = 1;

    constructor(private router: Router, private tableauScoreService: TableauScoreService) {}

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

    public allerAFinPartie(): void {
        this.router.navigateByUrl('/finPartie');
        this.tableauScoreService.temps = '3min 20s';
    }
}
