import { Observateur } from './Observateur';
export const TEMPS_INITIAL_MS:number = 15000;

export class Compteur {
    private temps: number = TEMPS_INITIAL_MS;
    private observateurs: Observateur[];

    constructor(observateurs: Observateur[]) {

    }

    public redemarrerTemps() {
        this.temps = TEMPS_INITIAL_MS;
    }

    public verifierTempsMS(): number {
        return this.temps;
    }

    public partirTemps() {
        // attend 1 second
        // décrémente temps
        // notifier observateur.
        // repeter jusqu'à temps = 0.
    }

    private tempsEcoule() {
        // redemarrer compteur
        // notifier observateur
    }
}