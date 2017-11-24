import { Pilote } from './Pilote';
import { Pilotes } from './Pilotes';
import { LigneArrivee } from './LigneArrivee';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { Voiture } from '../voiture/Voiture';
import { Router } from '@angular/router';
import { NOMBRE_DE_TOURS_PAR_DEFAULT } from './../constant';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { EtatPartie } from './EtatPartie';

export class Partie implements Observateur, Sujet {

    public static toursAComplete = NOMBRE_DE_TOURS_PAR_DEFAULT;
    public static tempsDepartMilisecondes = 0;
    public static aEteNotifie = false;
    public etatPartie: EtatPartie = EtatPartie.En_attente;

    public observateurs: Observateur[];

    private pilotes: Pilotes;
    private ligneArrivee: LigneArrivee;
    private routeur: Router;

    constructor (pilotes: Pilote[], ligneArrivee: LigneArrivee, toursAComplete?: number,
                 observateurs?: Observateur[], observateursPiloteJoueur?: Observateur[]) {
        this.pilotes = new Pilotes(pilotes);
        Partie.toursAComplete = (toursAComplete !== undefined) ? toursAComplete : NOMBRE_DE_TOURS_PAR_DEFAULT;
        this.ligneArrivee = ligneArrivee;
        this.pilotes.observerVoitures(this);
        this.observateurs = (observateurs !== undefined) ? observateurs : [];

        if (observateursPiloteJoueur !== undefined) {
            for (const observateurCourant of observateursPiloteJoueur) {
                this.pilotes.observerPiloteJoueur(observateurCourant);
            }
        }
    }

    public obtenirNombreVoitures(): number {
        return this.pilotes.obtenirNombrePilotes();
    }

    public demarrerPartie(): void {
        this.partirCompteur();
        this.notifierObservateurs(NotificationType.Non_definie);
        this.etatPartie = EtatPartie.En_cours;
    }

    public partirCompteur(): void {
        Partie.tempsDepartMilisecondes = Date.now();
    }

    public estDebute(): boolean {
        if (Partie.tempsDepartMilisecondes === undefined) {
            return false;
        }

        return true;
    }

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (!Partie.aEteNotifie) {
            const voitureCourante: Voiture = <Voiture> sujet;
            this.notifierObservateurs(NotificationType.Deplacement);
            this.pilotes.mettreAJourTemps();

            if (this.ligneArrivee.aFranchitLigne(voitureCourante)) {
                if (this.pilotes.aParcourueUneDistanceRaisonnable(voitureCourante)) {
                    Partie.aEteNotifie = true;
                    this.pilotes.incrementerTour(voitureCourante, Date.now() - Partie.tempsDepartMilisecondes);
                    this.notifierObservateurs(NotificationType.Tour_termine);

                    if (this.pilotes.aTermine()) {
                        this.etatPartie = EtatPartie.Termine;
                        this.notifierObservateurs(NotificationType.Non_definie);
                    }
                }
            }
        }
    }

    public ajouterRouteur(routeur: Router): void {
        this.routeur = routeur;
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
