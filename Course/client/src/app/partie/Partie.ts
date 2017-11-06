import { Pilote } from './Pilote';
import { Pilotes } from './Pilotes';
import { LigneArrivee } from './LigneArrivee';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { Voiture } from '../voiture/Voiture';
export const  NOMBRE_DE_TOURS_PAR_DEFAULT = 3;


export class Partie implements Observateur {
    public static toursAComplete = NOMBRE_DE_TOURS_PAR_DEFAULT;

    private pilotes: Pilotes;
    private tempsDepartMilisecondes: number;
    private ligneArrivee: LigneArrivee;

    constructor (pilotes: Pilote[], ligneArrivee: LigneArrivee, toursAComplete?: number) {
        this.pilotes = new Pilotes(pilotes);
        Partie.toursAComplete = (toursAComplete !== undefined) ? toursAComplete : NOMBRE_DE_TOURS_PAR_DEFAULT;
        this.ligneArrivee = ligneArrivee;
        this.pilotes.observerVoiture(this);
    }

    public demarrerPartie(): void {
        this.pilotes.demarrerMoteur();
        this.partirCompteur();
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
            this.pilotes.incrementerTour(voitureCourante, Date.now() - this.tempsDepartMilisecondes);
        }

    }
}