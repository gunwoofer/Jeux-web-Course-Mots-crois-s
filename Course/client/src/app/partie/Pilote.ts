import { NOMBRE_DE_TOURS_PAR_DEFAULT, PREMIER_TOUR } from './../constant';
import { Voiture } from '../voiture/Voiture';
import { Partie } from '../partie/Partie';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { Piste } from '../piste/piste.model';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
const DIFFERENCE_RAISONNABLE_DE_PARCOURS_A_IGNORE = 100;
export class Pilote implements Sujet {
    public static tempsTotal = 0;

    private voiture: Voiture;
    private estJoueur = false;
    public tempsMiliSecondsParTour: number[] = [];
    public tempsTourActuel: number;
    public tourCourant = PREMIER_TOUR;
    public tourACompleter = NOMBRE_DE_TOURS_PAR_DEFAULT;
    public position: number;

    private observateurs: Observateur[] = [];

    constructor(voiture: Voiture, estJoueur: boolean) {
        this.voiture = voiture;
        this.estJoueur = estJoueur;
        this.tourACompleter = Partie.toursAComplete;

        this.position = 1;
    }

    public aParcourueUneDistanceRaisonnable(): boolean {
        const distanceParcourueMinimal = this.voiture.distanceParcouru /
            (Piste.longueurPiste - DIFFERENCE_RAISONNABLE_DE_PARCOURS_A_IGNORE);
        if (distanceParcourueMinimal < this.tourCourant) {
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

    public mettreAJourTemps(tempsActuelMilliseconds: number): void {
        this.tempsTourActuel = (this.tempsMiliSecondsParTour.length === 0) ?
                                tempsActuelMilliseconds :    // Premier tour
                                tempsActuelMilliseconds - this.tempsMiliSecondsParTour[this.tourCourant - 2];
        Pilote.tempsTotal = tempsActuelMilliseconds;
        this.notifierObservateurs(NotificationType.Deplacement);
    }

    public termineTour(tempsMiliSeconds: number): void {
        this.tourACompleter--;
        this.tourCourant++;
        this.tempsMiliSecondsParTour.push(tempsMiliSeconds);
        this.notifierObservateurs(NotificationType.Tour_termine);

        if (this.aTermine()) {
            Pilote.tempsTotal = 0;
            for (const tempsDuTour of this.tempsMiliSecondsParTour) {
                Pilote.tempsTotal += tempsDuTour;
            }

            this.voiture.supprimerObservateurs();
        }

        Partie.aEteNotifie = false;
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
