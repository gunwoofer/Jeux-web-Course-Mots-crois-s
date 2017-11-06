import { Voiture } from '../voiture/Voiture';
import { Guid } from '../../../../commun/Guid';
import { Partie } from '../partie/Partie';
import { Observateur } from '../../../../commun/observateur/Observateur';

export const PREMIER_TOUR = 1;

export class Pilote {
    private voiture: Voiture;
    private tempsMiliSecondsParTour: number[] = [];
    private tourCourant = PREMIER_TOUR;
    private tourTermine = 0;
    private guidPilote = Guid.generateGUID();
    private estJoueur = false;

    constructor (voiture: Voiture, estJoueur: boolean) {
        this.voiture = voiture;
        this.estJoueur = estJoueur;
    }

    public estJoueurPrincipal(): boolean {
        return this.estJoueur;
    }

    public estAdversaire(): boolean {
        return !this.estJoueur;
    }

    public termineTour(tempsMiliSeconds: number) {
        this.tourTermine++;
        this.tempsMiliSecondsParTour.push(tempsMiliSeconds);

        if (this.aTermine()) {
            console.log('PARTIE TERMINE POUR JOUER : ' + this.guidPilote);
        }
    }

    public aTermine(): boolean {
        if (Partie.toursAComplete > this.tourTermine) {
            return false;
        }
        return true;
    }

    public demarrerMoteur(): void {
        // VROUM VROUM...
        // Permet l'activation des touches.
    }

    public estLePilote(voiture: Voiture): boolean {
        if (voiture === this.voiture) {
            return true;
        }
        return false;
    }

    public observerVoiture(observateur: Observateur) {
        this.voiture.ajouterObservateur(observateur);
    }
}
