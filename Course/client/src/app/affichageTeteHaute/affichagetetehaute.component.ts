import { NOMBRE_ARRONDI_DECIMALE } from './../constant';
import { Metrique } from './../../../../commun/metrique';
import { Component, OnInit } from '@angular/core';
import { AffichageTeteHaute } from './affichageTeteHaute';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { AffichageTeteHauteService } from './affichagetetehaute.service';

@Component({
    selector: 'app-affichagetetehaute-component',
    templateUrl: './affichagetetehaute.component.html',
    styleUrls: ['./affichagetetehaute.component.css']
})
export class AffichageTeteHauteComponent implements OnInit, Observateur {
    // Valeurs affichées a l'ecran
    public position: number;
    public nombrePilotes: number;
    public tourCourant: number;
    public nombreTours: number;
    public tempsTour: string;
    public tempsTotal: string;

    constructor(private affichageTeteHauteService: AffichageTeteHauteService) {
    }

    public ngOnInit(): void {
        this.affichageTeteHauteService.ajouterObservateur(this);
    }

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (type === NotificationType.MettreAJourAffichageTeteHaute) {
            const affichageTeteHaute: AffichageTeteHaute = <AffichageTeteHaute> sujet;

            this.position = affichageTeteHaute.position;
            this.nombrePilotes = affichageTeteHaute.nombrePilotes;
            this.tourCourant = (affichageTeteHaute.tourCourant <= affichageTeteHaute.nombreTours) ?
                                                affichageTeteHaute.tourCourant : this.tourCourant;
            this.nombreTours = affichageTeteHaute.nombreTours;
            this.tempsTour = (Metrique.convertirEnSecondes(affichageTeteHaute.tempsTour)).toFixed(NOMBRE_ARRONDI_DECIMALE);
            this.tempsTotal = (Metrique.convertirEnSecondes(affichageTeteHaute.tempsTotal)).toFixed(NOMBRE_ARRONDI_DECIMALE);
        }
    }
}
