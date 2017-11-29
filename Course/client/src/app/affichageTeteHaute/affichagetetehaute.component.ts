import { Component, OnDestroy, OnInit } from '@angular/core';
import { AffichageTeteHaute } from './AffichageTeteHaute';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { AffichageTeteHauteService } from './affichagetetehaute.service';

@Component({
    selector: 'app-affichagetetehaute-component',
    templateUrl: './affichagetetehaute.component.html',
    styleUrls: ['./affichagetetehaute.component.css']
})

export class AffichageTeteHauteComponent implements OnInit, OnDestroy, Observateur {
    // Valeurs affichées
    public position: number;
    public nombrePilotes: number;
    public tourCourant: number;
    public nombreTours: number;
    public tempsTour: string;
    public tempsTotal: string;


    private affichageTeteHauteService: AffichageTeteHauteService;

    constructor(affichageTeteHauteService: AffichageTeteHauteService) {
        this.affichageTeteHauteService = affichageTeteHauteService;
    }

    public ngOnInit(): void {
        this.affichageTeteHauteService.affichageTeteHaute.ajouterObservateur(this);
    }

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (type === NotificationType.MettreAJourAffichageTeteHaute) {
            const affichageTeteHaute: AffichageTeteHaute = <AffichageTeteHaute> sujet;

            this.position = affichageTeteHaute.position;
            this.nombrePilotes = affichageTeteHaute.nombrePilotes;
            this.tourCourant = (affichageTeteHaute.tourCourant <= affichageTeteHaute.nombreTours) ?
                                                affichageTeteHaute.tourCourant : this.tourCourant;
            this.nombreTours = affichageTeteHaute.nombreTours;

            this.tempsTour = (Math.pow(10, -3) * affichageTeteHaute.tempsTour).toFixed(2);

            this.tempsTotal = (Math.pow(10, -3) * affichageTeteHaute.tempsTotal).toFixed(2);
        }
    }

    public ngOnDestroy(): void {
    }

}
