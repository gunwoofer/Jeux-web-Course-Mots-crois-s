import { Pilote } from './Pilote';
import { Pilotes } from './Pilotes';
import { LigneArrivee } from './LigneArrivee';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { Voiture } from '../voiture/Voiture';
import { Router } from '@angular/router';
import { DUREE_STINGER } from '../musique/musique.model';

export const  NOMBRE_DE_TOURS_PAR_DEFAULT = 3;
export const FIN_PARTIE_URL = '/finPartie';
export const DUREE_STINGER_MILISECONDES = DUREE_STINGER * 1000;


export class Partie implements Observateur, Sujet {
    public static toursAComplete = NOMBRE_DE_TOURS_PAR_DEFAULT;
    public observateurs: Observateur[];

    private pilotes: Pilotes;
    private tempsDepartMilisecondes: number;
    private ligneArrivee: LigneArrivee;
    private routeur: Router;

    constructor (pilotes: Pilote[], ligneArrivee: LigneArrivee, toursAComplete?: number, observateurs?: Observateur[]) {
        this.pilotes = new Pilotes(pilotes);
        Partie.toursAComplete = (toursAComplete !== undefined) ? toursAComplete : NOMBRE_DE_TOURS_PAR_DEFAULT;
        this.ligneArrivee = ligneArrivee;
        this.pilotes.observerVoiture(this);
        this.observateurs = (observateurs !== undefined) ? observateurs : [];
    }

    public demarrerPartie(): void {
        this.pilotes.demarrerMoteur();
        this.partirCompteur();
        this.notifierObservateurs();
    }

    public partirCompteur(): void {
        this.tempsDepartMilisecondes = Date.now();
    }

    public estDebute(): boolean {
        if (this.tempsDepartMilisecondes === undefined) {
            return false;
        }

        return true;
    }

    public notifier(sujet: Sujet): void {
        // Le Sujet est une voiture.
        const voitureCourante: Voiture = <Voiture> sujet;

        if (this.ligneArrivee.aFranchitLigne(voitureCourante)) {

            // Vérifions si la distance parcourue est raisonnable avant d'attribuer un tour de plus au pilotre.
            if (this.pilotes.aParcourueUneDistanceRaisonnable(voitureCourante)) {
                this.pilotes.incrementerTour(voitureCourante, Date.now() - this.tempsDepartMilisecondes);

                if (this.pilotes.aTermine()) {
                    this.notifierObservateurs();
                    setInterval(this.voirPageFinPartie(), DUREE_STINGER_MILISECONDES);
                }
            }
        }

    }

    public voirPageFinPartie(): void {
        this.routeur.navigateByUrl(FIN_PARTIE_URL);
    }

    public ajouterRouteur(routeur: Router): void {
        this.routeur = routeur;
    }

    // Sujet


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

    public notifierObservateurs(): void {
        for (const observateurCourant of this.observateurs) {
            observateurCourant.notifier(this);
        }
    }
}