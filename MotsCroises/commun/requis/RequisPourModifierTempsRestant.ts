export class RequisPourModifierTempsRestant {
    public guidPartie: string;
    public tempsRestant: number;
    constructor(guidPartie: string, tempsRestant: number) {
        this.guidPartie = guidPartie;
        this.tempsRestant = tempsRestant;
    }
}