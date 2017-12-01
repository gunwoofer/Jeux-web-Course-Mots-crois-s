import { Injectable } from '@angular/core';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { AffichageTeteHaute } from './affichageTeteHaute';
import { Pilote } from '../partie/Pilote';

@Injectable()
export class AffichageTeteHauteService implements Observateur {
    private affichageTeteHaute: AffichageTeteHaute = new AffichageTeteHaute();
    private notifierVue = false;

    public mettreAJourAffichage(nombrePilotes: number, nombreTours: number): void {
        this.affichageTeteHaute.nombrePilotes = nombrePilotes;
        this.affichageTeteHaute.nombreTours = nombreTours;
        this.affichageTeteHaute.notifierObservateurs(NotificationType.MettreAJourAffichageTeteHaute);
    }

    public ajouterObservateur(observateur: Observateur): void {
        this.affichageTeteHaute.ajouterObservateur(observateur);
    }

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (Pilote.estUnPilote(sujet)) {
            const pilote: Pilote = <Pilote>sujet;
            this.notifierVue = true;
            this.miseAJourNotification(type, pilote);
        }

        if (this.notifierVue) {
            this.affichageTeteHaute.notifierObservateurs(NotificationType.MettreAJourAffichageTeteHaute);
            this.notifierVue = false;
        }
    }

    public miseAJourNotification(type: NotificationType, pilote: Pilote): void {
        if (type === NotificationType.Deplacement) {
            this.affichageTeteHaute.tempsTotal = Pilote.tempsTotal;
            this.affichageTeteHaute.tempsTour = pilote.tempsTourActuel;
        } else if (type === NotificationType.Nouvelle_position) {
            this.affichageTeteHaute.position = pilote.position;
        } else if (type === NotificationType.Tour_termine) {
            this.affichageTeteHaute.tourCourant = pilote.tourCourant;
        }
    }
}
