import { Pilote } from './Pilote';
import { Voiture } from '../voiture/Voiture';
import { IObservateur } from '../../../../commun/observateur/Observateur';
import { Partie } from './Partie';  // À utilisez qu'en lecture. Sinon, risque d'une dépendance circulaire.

export class Pilotes {
    private pilotes: Pilote[] = new Array();

    constructor(pilotes?: Pilote[]) {
        this.pilotes = (pilotes !== undefined) ? pilotes : [];
    }

    public obtenirNombrePilotes(): number {
        return 2;
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

    public observerVoitures(observateur: IObservateur): void {
        for (const piloteCourant of this.pilotes) {
            piloteCourant.observerVoiture(observateur);
        }
    }

    public observerPiloteJoueur(observateur: IObservateur): void {
        for (const piloteCourant of this.pilotes) {
            if (piloteCourant.estJoueurPrincipal()) {
                piloteCourant.ajouterObservateur(observateur);
            }
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

    public mettreAJourTemps(): void {
        for (const piloteCourant of this.pilotes) {
            piloteCourant.mettreAJourTemps(Date.now() - Partie.tempsDepartMilisecondes);
        }
    }
}
