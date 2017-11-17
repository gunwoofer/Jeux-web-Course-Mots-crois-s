import { Observateur } from './Observateur';
const TEMPS_INITIAL_MS = 30000;
const ATTENTE_MINIMAL_AVANT_PARTIR_TEMPS_MS = 1000;

export class Compteur {
    private tempsRestant: number = TEMPS_INITIAL_MS;
    private tempsLancement: any;
    public estFini: boolean;

    constructor(observateurs: Observateur[], temps?: number) {
        this.tempsRestant = Math.floor(temps);
    }

    public redemarrerTemps(): void {
        this.tempsRestant = TEMPS_INITIAL_MS;
    }

    public afficherTempsRestant(): number {
        const tempsRequete = new Date().getTime();

        this.tempsRestant -= tempsRequete - this.tempsLancement;

        if (this.tempsRestant <= 0) {
            this.tempsEcoule();
            return 0;
        }

        return this.tempsRestant;
    }

    public partirTemps(): void {
        this.wait(ATTENTE_MINIMAL_AVANT_PARTIR_TEMPS_MS);
        this.tempsLancement = new Date().getTime();
        this.estFini = false;
    }

    public wait(timeMs: number): void {
        const start = new Date().getTime();
        let end = start;

        while (end < start + timeMs) {
          end = new Date().getTime();
        }
     }

    private tempsEcoule(): void {
        this.redemarrerTemps();
        this.estFini = true;
    }
}
