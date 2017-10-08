import { Case, EtatCase } from './Case'; 

export const DIMENSION_LIGNE_COLONNE = 10;

export class Cases {
    private cases: Case[][] = new Array(DIMENSION_LIGNE_COLONNE);

    constructor() {
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            this.cases[i] = new Array(DIMENSION_LIGNE_COLONNE);
        }
    }

    public ajouterCase(caseAAjouter: Case, numeroLigne: number, numeroColonne: number): void {
        this.cases[numeroLigne][numeroColonne] = caseAAjouter;
    }

    public obtenirCase(numeroLigne: number, numeroColonne: number): Case {
        for(let ligneCase of this.cases) {
            for(let caseCourante of ligneCase) {
                if(numeroLigne === caseCourante.obtenirNumeroLigne() && numeroColonne === caseCourante.obtenirNumeroColonne()) {
                    return caseCourante;
                }
            }
        }

        return undefined;
    }

    public obtenirLigneCases(numeroLigne: number) : Case[] {
        return this.cases[numeroLigne];
    }

    public obtenirCases(): Case[][] {
        return this.cases;
    }

    public changerEtatCase(etatCase: EtatCase, numeroLigne: number, numeroColonne: number): void {
        this.cases[numeroLigne][numeroColonne].etat = etatCase;
    }

    public remplirCase(lettre: string, numeroLigne: number, numeroColonne: number): void {
        this.cases[numeroLigne][numeroColonne].remplirCase(lettre);
    }

}