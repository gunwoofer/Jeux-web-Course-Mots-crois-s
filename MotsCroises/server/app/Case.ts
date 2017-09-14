
export enum EtatCase {
    vide,
    pleine,
    noir
}


export class Case {
    private x : number;
    private y : number;

    private lettre : string;
    private etat : EtatCase;
    private intersection : boolean;

    constructor(x: number, y: number, etat: EtatCase) {
        this.x = x;
        this.y = y;
        this.etat = etat;

    }

    public getX(): number {
        return this.x;
    }
    
    public getY(): number {
        return this.y;
    }

    public remplirCase(lettre:string) {
        this.lettre = lettre;
        this.etat = EtatCase.pleine;
    }

    public viderCase() {
        this.etat = EtatCase.vide;
        this.lettre = "";
    }

    public setEtat(etat : EtatCase): void {
        this.etat = etat;
    }



}