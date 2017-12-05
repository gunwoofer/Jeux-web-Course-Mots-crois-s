import { Case } from './case';
import { Position } from './position';

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

    public viderCases(): void {
        for (const ligneCourante of this.obtenirCases()) {
            for (const caseCourante of ligneCourante) {
                caseCourante.viderCase();
            }
        }
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

    public obtenirCases(): Case[][] {
        return this.cases;
    }

    public remplirCase(lettre: string, numeroLigne: number, numeroColonne: number): void {
        this.cases[numeroLigne][numeroColonne].remplirCase(lettre);
    }

    public obtenirCasesSelonCaseDebut(caseDebut: Case, direction: Position, grandeur: number): Case[] {
        const cases: Case[] = new Array();
        let positionLigne: number;
        let positionColonne: number;

        for (let i = 0; i < grandeur; i++) {
            switch (direction) {
                case Position.Ligne:
                    positionLigne = caseDebut.obtenirNumeroLigne();
                    positionColonne = caseDebut.obtenirNumeroColonne() + i;
                    break;

                case Position.Colonne:
                    positionLigne = caseDebut.obtenirNumeroLigne() + i;
                    positionColonne = caseDebut.obtenirNumeroColonne();
                    break;
            }

            cases.push(this.obtenirCase(positionLigne, positionColonne));
        }

        return cases;
    }
    
    public obtenirMotDesCases(cases: Case[]): string {
        let motDansLesCases = '';

        for (const caseCourante of cases) {
            motDansLesCases += caseCourante.obtenirLettre();
        }

        return motDansLesCases;
    }

    public obtenirLongueurCases(): number {
        return DIMENSION_LIGNE_COLONNE;
    }

    public obtenirHauteurCases(): number {
        let nbrCasesY = 0;
        for (const casesDeLaLigne of this.obtenirCases()) {
            if (nbrCasesY !== 0 && nbrCasesY !== casesDeLaLigne.length) {
                return -1;
            }
            nbrCasesY = casesDeLaLigne.length;
        }
        return nbrCasesY;
    }
}
