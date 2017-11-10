export class RequisPourModifierTempsRestant {
    public guidPartie: string;
    public nouveauTemps: number;
    constructor(guidPartie: string, nouveauTemps: number) {
        this.guidPartie = guidPartie;
        this.nouveauTemps = nouveauTemps;
    }
}