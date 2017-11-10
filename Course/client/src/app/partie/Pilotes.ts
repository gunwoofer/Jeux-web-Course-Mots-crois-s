import { Pilote } from './Pilote';
import { Voiture } from '../voiture/Voiture';
import { Observateur } from '../../../../commun/observateur/Observateur';

export class Pilotes {
    private pilotes: Pilote[];

    constructor(pilotes?: Pilote[]) {
        this.pilotes = (pilotes !== undefined) ? pilotes : [];
    }

    public ajouterPilote(pilote: Pilote): void {
        this.pilotes.push(pilote);
    }

    public aTermine(): boolean {
        let termine = false;

        for (const piloteCourant of this.pilotes) {
            termine = (piloteCourant.aTermine()) ? true : termine;
        }

        return termine;
    }

    public incrementerTour(voitureCourant: Voiture, tempsActuelMilisecondes: number): void {
        for (const piloteCourant of this.pilotes) {
            if (piloteCourant.estLePilote(voitureCourant)) {
                piloteCourant.termineTour(tempsActuelMilisecondes);
            }
        }
    }

    public observerVoiture(observateur: Observateur): void {
        for (const piloteCourant of this.pilotes) {
            piloteCourant.observerVoiture(observateur);
        }
    }

    public aParcourueUneDistanceRaisonnable(voitureCourant: Voiture): boolean {
        for (const piloteCourant of this.pilotes) {
            if (piloteCourant.estLePilote(voitureCourant)) {
                return piloteCourant.aParcourueUneDistanceRaisonnable();
            }
        }

        return false;
    }
}
