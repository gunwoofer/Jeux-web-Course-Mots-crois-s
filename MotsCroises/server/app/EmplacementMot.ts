import { Case } from './Case';

export class EmplacementMot {
    private caseDebut: Case;
    private caseFin: Case;
    private cases: Case[];
    private grandeur: number;

    constructor(caseDebut: Case, caseFin: Case, cases: Case[]) {
        this.caseDebut = caseDebut;
        this.caseFin = caseFin;
        this.cases = cases;

        if (caseDebut.obtenirNumeroLigne() === caseFin.obtenirNumeroLigne()) {
            this.grandeur = caseFin.obtenirNumeroColonne() - caseDebut.obtenirNumeroColonne() + 1;
        } else if (caseDebut.obtenirNumeroColonne() === caseFin.obtenirNumeroColonne()) {
            this.grandeur = caseFin.obtenirNumeroLigne() - caseDebut.obtenirNumeroLigne() + 1;
        }

    }

    public obtenirCases(): Case[] {
        return this.cases;
    }

    public obtenirCase(i:number): Case {
        return this.cases[i];
    }

    public obtenirCaseDebut(): Case {
        return this.caseDebut;
    }

    public obtenirCaseFin(): Case {
        return this.caseFin;
    }

    public obtenirGrandeur(): number {
        return this.grandeur;
    }
}
