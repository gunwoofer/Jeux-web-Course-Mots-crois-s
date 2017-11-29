import { Case, EtatCase } from './Case';
import { Position } from './Position';

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
    
    public changerCases(cases: Case[][]): void {
        this.cases = cases;
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

    public obtenirLigneCases(numeroLigne: number) : Case[] {
        return this.cases[numeroLigne];
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

    
    public obtenirCaseSelonPosition(position: Position, indexFixe: number, index: number): Case {
        switch (position) {
            case Position.Ligne:
                return this.obtenirCase(indexFixe, index);

            case Position.Colonne:
                return this.obtenirCase(index, indexFixe);
        }
    }
    
    public obtenirMotDesCases(cases: Case[]): string {
        let motDansLesCases = '';

        for (const caseCourante of cases) {
            motDansLesCases += caseCourante.obtenirLettre();
        }

        return motDansLesCases;
    }
    

    public calculerPointsContraintesDeLaCase(caseCourante: Case, numeroLigneCourant: number, numeroColonneCourant: number): Case {
        // Cas une case en bas contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(numeroLigneCourant + 1, numeroColonneCourant))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Colonne);
        }

        // Cas une case à droite contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(numeroLigneCourant, numeroColonneCourant + 1))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Ligne);
        }

        // Cas une case en haut contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(numeroLigneCourant - 1, numeroColonneCourant))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Colonne);
        }

        // Cas une case à gauche contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(numeroLigneCourant, numeroColonneCourant - 1))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Ligne);
        }

        return caseCourante;
    }
    
    public calculerPointsContraintes(): void {
        let caseCourante: Case;
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                caseCourante = this.obtenirCase(i, j);
                caseCourante.remettrePointsContraintesAZero();
                this.calculerPointsContraintesDeLaCase(caseCourante,
                    caseCourante.obtenirNumeroLigne(), caseCourante.obtenirNumeroColonne());
            }
        }
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

    private peutAccueillirLettre(caseAVerifier: Case): boolean {
        if (caseAVerifier !== null && (caseAVerifier !== undefined)) {
            if (caseAVerifier.etat === EtatCase.vide) {
                return true;
            }
        }

        return false;
    }
}
