import { Position } from './Position';

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

    constructor(numeroLigne: number, numeroColonne: number, etat: EtatCase) {
        this.numeroLigne = numeroLigne;
        this.numeroColonne = numeroColonne;
        this.etat = etat;

    }

    public obtenirEtat(): EtatCase { 
        return this.etat; 
    } 

    public copieCase(): Case { 
        let newCase = new Case(this.numeroLigne, this.numeroColonne, this.etat); 
        newCase.lettre = this.lettre; 
        return newCase; 
    } 

    public obtenirNumeroLigne(): number {
        return this.numeroLigne;
    }

    public obtenirNumeroColonne(): number {
        return this.numeroColonne;
    }

    public obtenirLettre(): string {
        return this.lettre;
    }

    public remplirCase(lettre: string): void {
        this.lettre = lettre;
        this.etat = EtatCase.pleine;
    }

    public viderCase(): void {
        this.lettre = '';
    }
}
