import { Observateur } from './Observateur';
export const TEMPS_INITIAL_MS:number = 30000;

export class Compteur {
    private temps_restant: number = TEMPS_INITIAL_MS;
    private observateurs: Observateur[];
    private temps_lancement: any;  //Date().getTime()
    
    public estFini: boolean;

    constructor(observateurs: Observateur[], temps?: number) {
        this.temps_restant = Math.floor(temps);
    }

    public redemarrerTemps() {
        this.temps_restant = TEMPS_INITIAL_MS;
    }

    public afficherTempsRestant(): number {
        let temps_requete = new Date().getTime();
        this.temps_restant -= temps_requete - this.temps_lancement;
        if (this.temps_restant <= 0) {
            this.tempsEcoule();
            return 0;
        }
        return this.temps_restant;  //Temps restant en ms
    }

    public partirTemps() {
        // attend 1 second
        this.wait(1000);
        // décrémente temps
        this.temps_lancement = new Date().getTime();
        // notifier observateur ?
        console.log("Le chrono est parti !");
        // repeter jusqu'à temps = 0.
        this.estFini = false;
    }

    public wait(time_ms: number){
        var start = new Date().getTime();
        var end = start;
        while(end < start + time_ms) {
          end = new Date().getTime();
       }
     }

    private tempsEcoule() {
        // redemarrer compteur
        this.redemarrerTemps();
        // notifier observateur
        console.log("Compte a rebour terminé");
        this.estFini = true;
    }
}