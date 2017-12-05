import { PREMIER_TOUR } from './../constant';
import { IObservateur } from '../../../../commun/observateur/Observateur';
import { ISujet } from '../../../../commun/observateur/Sujet';
import { NotificationType } from '../../../../commun/observateur/NotificationType';

export class AffichageTeteHaute implements ISujet {
    public position: number;
    public nombrePilotes: number;
    public nombreTours: number;
    public tempsTour: number;
    public tempsTotal: number;

    private observateurs: IObservateur[] = new Array();

    constructor(public tourCourant = PREMIER_TOUR) {
    }

    public ajouterObservateur(observateur: IObservateur): void {
        this.observateurs.push(observateur);
    }

    public supprimerObservateur(observateur: IObservateur): void {
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
