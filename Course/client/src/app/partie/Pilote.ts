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
    private tourACompleter = NOMBRE_DE_TOURS_PAR_DEFAULT;
    private guidPilote = Guid.generateGUID();
    private estJoueur = false;

    constructor (voiture: Voiture, estJoueur: boolean, tourACompleter?: number) {
        this.voiture = voiture;
        this.estJoueur = estJoueur;
        this.tourACompleter = (tourACompleter !== undefined) ? tourACompleter : NOMBRE_DE_TOURS_PAR_DEFAULT;
    }

    public aParcourueUneDistanceRaisonnable(): boolean {
        if ( this.voiture.distanceParcouru / (Piste.longueurPiste - DIFFERENCE_DISTANCE_PARCOURUE_RAISONNABLE) < this.tourCourant ) {
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

    public termineTour(tempsMiliSeconds: number) {
        this.tourACompleter--;
        this.tourCourant++;
        this.tempsMiliSecondsParTour.push(tempsMiliSeconds);

        if (this.aTermine()) {
            console.log('PARTIE TERMINE POUR JOUER : ' + this.guidPilote);

            Pilote.tempsTotal = 0;
            for(const tempsDuTour of this.tempsMiliSecondsParTour) {
                Pilote.tempsTotal += tempsDuTour;
            }

            this.voiture.supprimerObservateurs();
            console.log('TEMPS TOTAL : ' + Pilote.tempsTotal + 'ms' );
        } else {
            console.log('TEMPS COURANT : ' + this.tempsMiliSecondsParTour[this.tourCourant - 2] + 'ms' );
        }
    }

    public aTermine(): boolean {
        if (this.tourACompleter > 0) {
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
