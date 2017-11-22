import { Component, OnDestroy, OnInit } from '@angular/core';
import { AffichageTeteHaute } from './AffichageTeteHaute';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { Partie } from '../partie/Partie';
import { AffichageTeteHauteService } from './affichagetetehaute.service';

@Component({
    selector: 'app-affichagetetehaute-component',
    templateUrl: './affichagetetehaute.component.html',
    styleUrls: ['./affichagetetehaute.component.css']
})

export class AffichageTeteHauteComponent implements OnInit, OnDestroy, Observateur {
    // Valeurs affichées
    private position: number;
    private nombreVoiture: number;
    private toursComplete: number;
    private nombreTours: number;
    private tempsTour: number;
    private tempsTotal: number;


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
            this.nombreVoiture = affichageTeteHaute.nombreVoiture;
            this.toursComplete = affichageTeteHaute.toursComplete;
            this.nombreTours = affichageTeteHaute.nombreTours;
            this.tempsTour = affichageTeteHaute.tempsTour;
            this.tempsTotal = affichageTeteHaute.tempsTotal;
        }
    }

    public ngOnDestroy(): void {
    }

}
