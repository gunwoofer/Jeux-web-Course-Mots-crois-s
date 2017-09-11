
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

    public getx(): number {
        return this.x;
    }
    
    public gety(): number {
        return this.y;
    }

    public setEtat(etat : EtatCase): void {
        this.etat = etat;
    }



}