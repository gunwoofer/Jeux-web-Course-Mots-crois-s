import { Case } from './Case';
import { Position } from './Grille';

export class EmplacementMot {
    private caseDebut: Case;
    private caseFin: Case;
    private cases: Case[];
    private grandeur: number;
    private position: Position;

    constructor(caseDebut: Case, caseFin: Case, cases: Case[]) {
        this.caseDebut = caseDebut;
        this.caseFin = caseFin;
        this.cases = cases;

        if (caseDebut.obtenirNumeroLigne() === caseFin.obtenirNumeroLigne()) {
            this.grandeur = caseFin.obtenirNumeroColonne() - caseDebut.obtenirNumeroColonne() + 1;
            this.position = Position.Ligne;
        } else if (caseDebut.obtenirNumeroColonne() === caseFin.obtenirNumeroColonne()) {
            this.grandeur = caseFin.obtenirNumeroLigne() - caseDebut.obtenirNumeroLigne() + 1;
            this.position = Position.Colonne;
        }

    }

    public obtenirPosition(): Position {
        return this.position;
    }

    public obtenirCases(): Case[] {
        return this.cases;
    }

    public obtenirCase(i: number): Case {
        return this.cases[i];
    }

    public obtenirCaseSelonLigneColonne(numeroLigne: number, numeroColonne: number): Case {
        for (const caseCourante of this.cases) {
            if ((caseCourante.obtenirNumeroLigne() === numeroLigne)
                && (caseCourante.obtenirNumeroColonne() === numeroColonne)) {
                return caseCourante;
            }
        }

        return undefined;
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
