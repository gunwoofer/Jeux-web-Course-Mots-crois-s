import { Case } from './Case';

export class EmplacementMot {
    private caseDebut: Case;
    private caseFin: Case;
    private cases: Case[];
    private grandeur: number;

    constructor(caseDebut:Case, caseFin:Case, cases:Case[]) {
        this.caseDebut = caseDebut;
        this.caseFin = caseFin;
        this.cases = cases;

        if (caseDebut.obtenirX() === caseFin.obtenirX()) {
            this.grandeur = caseFin.obtenirY() - caseDebut.obtenirY();
        } else if (caseDebut.obtenirY() === caseFin.obtenirY()) {
            this.grandeur = caseFin.obtenirX() - caseDebut.obtenirX();
        }

    }

    public obtenirCases(): Case[] {
        return this.cases;
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