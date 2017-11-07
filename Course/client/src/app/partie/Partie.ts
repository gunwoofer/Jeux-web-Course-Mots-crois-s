import { Pilotes } from './Pilotes';
import { LigneArrivee } from './LigneArrivee';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { Voiture } from '../voiture/Voiture';
export const  NOMBRE_DE_TOURS_PAR_DEFAULT = 3;


export class Partie implements Observateur{
    private pilotes: Pilotes;
    private toursACompleter = NOMBRE_DE_TOURS_PAR_DEFAULT;
    private tempsDepart: number;
    private ligneArrivee: LigneArrivee;

    constructor (pilotes: Pilotes, ligneArrivee: LigneArrivee) {
        this.pilotes = pilotes;
    }

    public demarrerPartie(): void {
        this.pilotes.demarrerMoteur();
        this.partirCompteur();
    }

    public partirCompteur(): void {
        this.tempsDepart = Date.now();
    }

    public estDebute(): boolean {
        if (this.tempsDepart === undefined) {
            return false;
        }

        return true;
    }

    public notifier(sujet: Sujet): void {
        // Le Sujet est une voiture.
        const voitureCourant: Voiture = <Voiture> sujet;

        if (this.ligneArrivee.aFranchitLigne(voitureCourant)) {
            
        }

    }
}