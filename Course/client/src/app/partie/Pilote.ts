import { Voiture } from '../voiture/Voiture';
import { Guid } from '../../../../commun/Guid';

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
        return false;
    }

    public demarrerMoteur(): void {
        // VROUM VROUM...
    }

    public estLePilote(voiture: Voiture): boolean {
        if (voiture === this.voiture) {
            return true;
        }
        return false;
    }
}
