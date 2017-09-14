
export enum EtatCase {
    vide,
    pleine,
    noir
}


export class Case {
    private x : number;
    private y : number;

    private lettre : string;
    public etat : EtatCase;
    private intersection : boolean;

    constructor(x: number, y: number, etat: EtatCase) {
        this.x = x;
        this.y = y;
        this.etat = etat;

    }

    public obtenirX(): number {
        return this.x;
    }
    
    public obtenirY(): number {
        return this.y;
    }

    public obtenirLettre():string{
        return this.lettre;
    }

    public remplirCase(lettre:string) {
        this.lettre = lettre;
        this.etat = EtatCase.pleine;
    }

    public viderCase() {
        this.etat = EtatCase.vide;
        this.lettre = "";
    }
}