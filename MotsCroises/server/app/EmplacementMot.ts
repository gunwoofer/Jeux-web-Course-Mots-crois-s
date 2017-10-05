import { Case } from './Case';
import { Position } from './Grille';

export enum EtatEmplacementMot {
    Masque,
    Trouve
}

export class EmplacementMot {
    private caseDebut: Case;
    private caseFin: Case;
    private cases: Case[];
    private grandeur: number;
    private position: Position;
    private etatEmplacementMot: EtatEmplacementMot;

    constructor(caseDebut?: Case, caseFin?: Case, cases?: Case[]) {
        this.caseDebut = caseDebut;
        this.caseFin = caseFin;
        this.cases = cases;
        this.etatEmplacementMot = EtatEmplacementMot.Masque;

        if (caseDebut.obtenirNumeroLigne() === caseFin.obtenirNumeroLigne()) {
            this.grandeur = caseFin.obtenirNumeroColonne() - caseDebut.obtenirNumeroColonne() + 1;
            this.position = Position.Ligne;
        } else if (caseDebut.obtenirNumeroColonne() === caseFin.obtenirNumeroColonne()) {
            this.grandeur = caseFin.obtenirNumeroLigne() - caseDebut.obtenirNumeroLigne() + 1;
            this.position = Position.Colonne;
        }

    }

    public estTrouve() {
        this.etatEmplacementMot = EtatEmplacementMot.Trouve;
    }

    public estHorizontal(): boolean {
        if(this.position === Position.Ligne) {
            return true;
        }
        return false;
    }

    public estVertical(): boolean {
        if(this.position === Position.Colonne) {
            return true;
        }
        return false;
    }

    public copieEmplacement(): EmplacementMot {
        
       let newEmplacement = new EmplacementMot(this.caseDebut.copieCase(), this.caseFin.copieCase());
       newEmplacement.cases = new Array();
       for(let i = 0; i < this.cases.length; i++) {
           newEmplacement.cases[i] = this.cases[i].copieCase();
       }
       newEmplacement.grandeur = this.grandeur;
       newEmplacement.position = this.position;
       
       return newEmplacement;
    }

    public obtenirPosition(): Position {
        return this.position;
    }

    public obtenirCases(): Case[] {
        return this.cases;
    }

    public obtenirMotDesCases(): String {
        let motDansLesCases: String = '';

        for(let caseCourante of this.cases) {
            motDansLesCases += caseCourante.obtenirLettre();
        }

        return motDansLesCases;
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
