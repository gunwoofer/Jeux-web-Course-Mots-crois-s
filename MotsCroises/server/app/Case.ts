import { Position } from './Grille';

export enum EtatCase {
    vide,
    pleine,
    noir
}

export class Case {
    private x: number;
    private y: number;

    private lettre: string;
    public etat: EtatCase;
    public intersection = false;


    private pointsDeContraintes = 0;
    private pointsDeContraintesProvenance: Position[];

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

    public obtenirPointsDeContraintes(): number {
        return this.pointsDeContraintes;
    }

    public comparerCase(caseAComparer: Case): boolean {
        return ((this.etat === caseAComparer.etat)
            && (this.x === caseAComparer.obtenirX())
            && (this.y === caseAComparer.obtenirY())
            && (this.lettre === caseAComparer.obtenirLettre()));
    }

    public obtenirLettre(): string {
        return this.lettre;
    }

    public remplirCase(lettre: string): void {
        this.lettre = lettre;
        this.etat = EtatCase.pleine;
    }

    public ajouterUnPointDeContrainte(position: Position, increment: number = 1): void {
        this.pointsDeContraintes += increment;
        this.pointsDeContraintesProvenance.push(position);

        if (this.pointsDeContraintes >= 2) {
            const positionPrecedente: Position = this.pointsDeContraintesProvenance[0];
            for (const positionCourante of this.pointsDeContraintesProvenance) {
                if (positionPrecedente !== positionCourante) {
                    this.intersection = true;
                }
            }
        }

        if (this.pointsDeContraintes >= 3) {
            this.intersection = true;
        }

        if (this.obtenirX() === 0 && this.obtenirY() === 0 && this.pointsDeContraintes >= 2) {
            this.intersection = true;
        }

        if (this.obtenirX() === 0 && this.obtenirY() === 9 && this.pointsDeContraintes >= 2) {
            this.intersection = true;
        }

        if (this.obtenirX() === 9 && this.obtenirY() === 0 && this.pointsDeContraintes >= 2) {
            this.intersection = true;
        }

        if (this.obtenirX() === 9 && this.obtenirY() === 9 && this.pointsDeContraintes >= 2) {
            this.intersection = true;
        }
    }

    public remettrePointsContraintesAZero(): void {
        this.pointsDeContraintes = 0;
        this.pointsDeContraintesProvenance = new Array();
        this.intersection = false;
    }

    public viderCase(): void {
        this.etat = EtatCase.vide;
        this.lettre = '';
    }
}
