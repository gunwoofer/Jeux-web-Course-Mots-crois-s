import { Voiture } from '../voiture/Voiture';
import { Guid } from '../../../../commun/Guid';
import { Partie, NOMBRE_DE_TOURS_PAR_DEFAULT } from '../partie/Partie';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { Piste } from '../piste/piste.model';
export const PREMIER_TOUR = 1;

// Distance de la piste. À trouver.
export const DISTANCE_DE_LA_PISTE = 1;
export const DIFFERENCE_DISTANCE_PARCOURUE_RAISONNABLE = 100;

export class Pilote {
    public static tempsTotal = 0;

    private voiture: Voiture;
    private tempsMiliSecondsParTour: number[] = [];
    private tourCourant = PREMIER_TOUR;
    public tourACompleter = NOMBRE_DE_TOURS_PAR_DEFAULT;
    private guidPilote = Guid.generateGUID();
    private estJoueur = false;

    constructor(voiture: Voiture, estJoueur: boolean) {
        this.voiture = voiture;
        this.estJoueur = estJoueur;
        this.tourACompleter = Partie.toursAComplete;
    }

    public aParcourueUneDistanceRaisonnable(): boolean {
        if (this.voiture.distanceParcouru / (Piste.longueurPiste / 2) < this.tourCourant) {
            return false;
        }
        return true;
    }

    public estJoueurPrincipal(): boolean {
        return this.estJoueur;
    }

    public estAdversaire(): boolean {
        return !this.estJoueur;
    }

    public termineTour(tempsMiliSeconds: number): void {
        this.tourACompleter--;
        this.tourCourant++;
        this.tempsMiliSecondsParTour.push(tempsMiliSeconds);

        if (this.aTermine()) {
            Pilote.tempsTotal = 0;
            for (const tempsDuTour of this.tempsMiliSecondsParTour) {
                Pilote.tempsTotal += tempsDuTour;
            }

            this.voiture.supprimerObservateurs();
        }
    }

    public aTermine(): boolean {
        if (this.tourACompleter > 0) {
            return false;
        }
        return true;
    }

    public estLePilote(voiture: Voiture): boolean {
        if (voiture === this.voiture) {
            return true;
        }
        return false;
    }

    public observerVoiture(observateur: Observateur): void {
        this.voiture.ajouterObservateur(observateur);
    }
}
