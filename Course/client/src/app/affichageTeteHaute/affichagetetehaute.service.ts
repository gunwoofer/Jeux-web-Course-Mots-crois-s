
import { Injectable } from '@angular/core';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { AffichageTeteHaute } from './AffichageTeteHaute';

@Injectable()
export class AffichageTeteHauteService implements Observateur {
    public affichageTeteHaute: AffichageTeteHaute = new AffichageTeteHaute();

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (type === NotificationType.Deplacement) {
            // Modifier temps écoulé depuis tour
            // Modifier temps écoulé depuis debut
        }

        if (type === NotificationType.Nouvelle_position) {
            // Modifier position
        }

        if (type === NotificationType.Tour_termine) {
            // Modifier nombre tours complété.
        }
    }
}