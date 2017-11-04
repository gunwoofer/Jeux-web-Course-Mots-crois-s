import { Component } from '@angular/core';


@Component({
    selector: 'app-configurationpartie',
    templateUrl: './configurationPartie.component.html',
    styleUrls: ['./configurationPartie.component.css']
})

export class ConfigurationPartieComponent {
    private nombreDesTours = 0;

    public augmenterNombreTour(): void {
        if (this.nombreDesTours !== 3) {
            this.nombreDesTours++;
        }
    }

    public diminuerNombreTour(): void {
        if (this.nombreDesTours !== 0) {
            this.nombreDesTours--;
        }
    }
}
