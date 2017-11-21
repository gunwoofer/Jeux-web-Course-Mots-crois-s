import { Observateur } from '../../../../commun/observateur/Observateur';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { NotificationType } from '../../../../commun/observateur/NotificationType';

export class AffichageTeteHaute implements Observateur {


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
