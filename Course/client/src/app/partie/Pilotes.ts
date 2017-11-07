import { Pilote } from './Pilote';

export class Pilotes {
    private pilotes: Pilote[];
    constructor() {

    }

    public ajouterPilote(pilote: Pilote): void {
        this.pilotes.push(pilote);
    }

    public demarrerMoteur() {

        for (const piloteCourant of this.pilotes) {
            piloteCourant.demarrerMoteur();
        }

    }
}