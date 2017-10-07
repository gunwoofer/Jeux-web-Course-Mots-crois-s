import { Case } from './Case';
import { Position } from './Grille';
import { MotComplet } from './MotComplet';

export enum EtatEmplacementMot {
    Masque,
    Trouve
}

export class EmplacementMot {
    private caseDebut: Case;
    private caseFin: Case;
    private cases: Case[] = new Array();
    private grandeur: number;
    private position: Position;
    private etatEmplacementMot: EtatEmplacementMot;
    public motsImpossible: MotComplet[] = new Array();

    constructor(caseDebut?: Case, caseFin?: Case, cases?: Case[]) {
        if(caseDebut !== undefined) {
            this.caseDebut = caseDebut;
        }
        if(caseFin !== undefined) {
            this.caseFin = caseFin;
        }
        if(cases !== undefined) {
            this.cases = cases;
        }
        this.etatEmplacementMot = EtatEmplacementMot.Masque;
        this.motsImpossible = new Array();

        if(caseDebut !== undefined && caseFin !== undefined) {
            if (caseDebut.obtenirNumeroLigne() === caseFin.obtenirNumeroLigne()) {
                this.grandeur = caseFin.obtenirNumeroColonne() - caseDebut.obtenirNumeroColonne() + 1;
                this.position = Position.Ligne;
            } else if (caseDebut.obtenirNumeroColonne() === caseFin.obtenirNumeroColonne()) {
                this.grandeur = caseFin.obtenirNumeroLigne() - caseDebut.obtenirNumeroLigne() + 1;
                this.position = Position.Colonne;
            }
        }
    }

    public estEgale(emplacement: EmplacementMot): boolean {
        if(emplacement.grandeur !== this.grandeur) {
            return false;
        }
        for(let i = 0; i < this.grandeur; i++) {
            if((this.cases[i].obtenirNumeroLigne() !== emplacement.cases[i].obtenirNumeroLigne()) 
                || (this.cases[i].obtenirNumeroColonne() !== emplacement.cases[i].obtenirNumeroColonne())) {
                    return false;
                }
        }
        return true;
    }

    public estBanni(mot: MotComplet): boolean {
        for(let i = 0; i < this.motsImpossible.length; i++) {
            if(mot.estEgale(this.motsImpossible[i])) {
                return true;
            }
        }
        return false;
    }

    public ajouterMotImpossible(mot: MotComplet) {
        this.motsImpossible.push(mot);
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
       for(let i = 0; i < this.motsImpossible.length; i++) {
           newEmplacement.motsImpossible[i] = this.motsImpossible[i].copieMot();
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

    public obtenirMotDesCases(): string {
        let motDansLesCases: string = '';

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

    public modifierCases(cases: Case[]) {
        this.cases = cases;
    }
}
