
export enum EtatCase {
    vide,
    pleine,
    noir
}


export class Case {
    private x : number;
    private y : number;

    private lettre: string;
    public etat: EtatCase;
    public intersection: boolean = false;;

    private pointsDeContraintes: number = 0;

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

    public obtenirPointsDeContraintes(): number{
        return this.pointsDeContraintes;
    }

    public comparerCase(caseAComparer: Case): boolean {
        return ((this.etat === caseAComparer.etat)
        && (this.x === caseAComparer.obtenirX())
        && (this.y === caseAComparer.obtenirY())
        && (this.lettre === caseAComparer.obtenirLettre()));
    }

    public obtenirLettre():string{
        return this.lettre;
    }

    public remplirCase(lettre:string) {
        this.lettre = lettre;
        this.etat = EtatCase.pleine;
    }

    public ajouterUnPointDeContrainte(increment:number = 1) {
        this.pointsDeContraintes += increment;
        this.intersection = true;
    }

    public remettrePointsContraintesAZero() {
        this.pointsDeContraintes = 0;
        this.intersection = false;
    }

    public viderCase() {
        this.etat = EtatCase.vide;
        this.lettre = "";
    }
}