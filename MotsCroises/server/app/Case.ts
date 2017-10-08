import { Position } from './Grille';

export enum EtatCase {
    vide,
    pleine,
    noir
}

export class Case {
    private numeroLigne: number;
    private numeroColonne: number;

    private lettre = '';
    public etat: EtatCase;
    public intersection = false;


    private pointsDeContraintes = 0;
    private pointsDeContraintesProvenance: Position[];

    constructor(numeroLigne: number, numeroColonne: number, etat: EtatCase) {
        this.numeroLigne = numeroLigne;
        this.numeroColonne = numeroColonne;
        this.etat = etat;

    }

    public copieCase(): Case {
        let newCase = new Case(this.numeroLigne, this.numeroColonne, this.etat);
        newCase.lettre = this.lettre;
        newCase.intersection = this.intersection;
        newCase.pointsDeContraintes = this.pointsDeContraintes;
        newCase.pointsDeContraintesProvenance = new Array();
        for(let i = 0; i < this.pointsDeContraintesProvenance.length; i++) {
            newCase.pointsDeContraintesProvenance[i] = this.pointsDeContraintesProvenance[i];
        }
        return newCase;
    }

    public obtenirNumeroLigne(): number {
        return this.numeroLigne;
    }

    public obtenirNumeroColonne(): number {
        return this.numeroColonne;
    }

    public obtenirPointsDeContraintes(): number {
        return this.pointsDeContraintes;
    }

    public comparerCase(caseAComparer: Case): boolean {
        return ((this.etat === caseAComparer.etat)
            && (this.numeroLigne === caseAComparer.obtenirNumeroLigne())
            && (this.numeroColonne === caseAComparer.obtenirNumeroColonne())
            && (this.lettre === caseAComparer.obtenirLettre()));
    }

    public obtenirLettre(): string {
        return this.lettre;
    }

    public obtenirEtat(): EtatCase {
        return this.etat;
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

        if (this.obtenirNumeroLigne() === 0 && this.obtenirNumeroColonne() === 0 && this.pointsDeContraintes >= 2) {
            this.intersection = true;
        }

        if (this.obtenirNumeroLigne() === 0 && this.obtenirNumeroColonne() === 9 && this.pointsDeContraintes >= 2) {
            this.intersection = true;
        }

        if (this.obtenirNumeroLigne() === 9 && this.obtenirNumeroColonne() === 0 && this.pointsDeContraintes >= 2) {
            this.intersection = true;
        }

        if (this.obtenirNumeroLigne() === 9 && this.obtenirNumeroColonne() === 9 && this.pointsDeContraintes >= 2) {
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
