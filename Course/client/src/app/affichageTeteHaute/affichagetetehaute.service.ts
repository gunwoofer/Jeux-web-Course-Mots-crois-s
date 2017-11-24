
import { Injectable } from '@angular/core';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { AffichageTeteHaute } from './AffichageTeteHaute';
import { Pilote } from '../partie/Pilote';

@Injectable()
export class AffichageTeteHauteService implements Observateur {
    public affichageTeteHaute: AffichageTeteHaute = new AffichageTeteHaute();
    private notifierVue = false;

    public mettreAJourAffichage(nombrePilotes: number, nombreTours: number): void {
        this.affichageTeteHaute.nombrePilotes = nombrePilotes;
        this.affichageTeteHaute.nombreTours = nombreTours;
        this.affichageTeteHaute.notifierObservateurs(NotificationType.MettreAJourAffichageTeteHaute);
    }

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (this.estUnPilote(sujet)) {
            const pilote: Pilote = <Pilote> sujet;
            this.notifierVue = true;

            if (type === NotificationType.Deplacement) {
                this.affichageTeteHaute.tempsTotal = Pilote.tempsTotal;
                this.affichageTeteHaute.tempsTour = pilote.tempsTourActuel;
            }

            if (type === NotificationType.Nouvelle_position) {
                this.affichageTeteHaute.position = pilote.position;
            }

            if (type === NotificationType.Tour_termine) {
                this.affichageTeteHaute.tourCourant = pilote.tourCourant;
            }
        }

        if (this.notifierVue) {
            this.affichageTeteHaute.notifierObservateurs(NotificationType.MettreAJourAffichageTeteHaute);
            this.notifierVue = false;
        }
    }

    private estUnPilote(sujet: Sujet): boolean {
        if (sujet instanceof Pilote) {
            return true;
        }

        return false;
    }
}
