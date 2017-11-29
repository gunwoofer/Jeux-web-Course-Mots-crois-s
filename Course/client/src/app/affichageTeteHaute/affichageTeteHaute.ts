import { PREMIER_TOUR } from './../constant';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { NotificationType } from '../../../../commun/observateur/NotificationType';

export class AffichageTeteHaute implements Sujet {
    public position: number;
    public nombrePilotes: number;
    public nombreTours: number;
    public tempsTour: number;
    public tempsTotal: number;

    private observateurs: Observateur[] = new Array();

    constructor(public tourCourant = PREMIER_TOUR) {
    }

    public ajouterObservateur(observateur: Observateur): void {
        this.observateurs.push(observateur);
    }

    public supprimerObservateur(observateur: Observateur): void {
        for (let i = 0; i < this.observateurs.length; i++) {
            if (this.observateurs[i] === observateur) {
                this.observateurs.splice(i, 1);
            }
        }
    }

    public notifierObservateurs(type: NotificationType): void {
        for (const observateurCourant of this.observateurs) {
            observateurCourant.notifier(this, type);
        }
    }
}
