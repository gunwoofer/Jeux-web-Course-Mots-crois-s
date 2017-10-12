import { Case, EtatCase } from './Case';
import { Position } from './Position';
import { Guid } from './Guid';
import { Indice } from '../server/app/Indice';

export enum EtatEmplacementMot {
    Masque,
    Trouve
}

export class EmplacementMot {
    private caseDebut: Case;
    private caseFin: Case;
    private grandeur: number;
    private position: Position;
    private indexFixe: number;
    private etatEmplacementMot: EtatEmplacementMot;
    public motsImpossible: string[] = new Array();
    private GuidIndice: string = '';


    public static creerInstanceAvecJSON(): EmplacementMot {
        return new EmplacementMot(new Case(1,1,EtatCase.vide), new Case(1,3,EtatCase.vide));
    }


    constructor(caseDebut: Case, caseFin: Case) {
        if(caseDebut !== undefined) {
            this.caseDebut = caseDebut;
        }
        if(caseFin !== undefined) {
            this.caseFin = caseFin;
        }
        this.etatEmplacementMot = EtatEmplacementMot.Masque;
        this.motsImpossible = new Array();

        if(caseDebut !== undefined && caseFin !== undefined) {
            if (caseDebut.obtenirNumeroLigne() === caseFin.obtenirNumeroLigne()) {
                this.grandeur = caseFin.obtenirNumeroColonne() - caseDebut.obtenirNumeroColonne() + 1;
                this.position = Position.Ligne;
                this.indexFixe = caseFin.obtenirNumeroLigne();
            } else if (caseDebut.obtenirNumeroColonne() === caseFin.obtenirNumeroColonne()) {
                this.grandeur = caseFin.obtenirNumeroLigne() - caseDebut.obtenirNumeroLigne() + 1;
                this.position = Position.Colonne;
                this.indexFixe = caseDebut.obtenirNumeroColonne();
            }
        }
    }
    

    public modifierCaseDebutFin(caseDebut: Case, caseFin: Case): void {
        this.caseDebut = caseDebut;
        this.caseFin = caseFin;
    }
    
    public obtenirIndexFixe(): number {
        return this.indexFixe;
    }

    public estBanni(mot: string): boolean {
        for(let i = 0; i < this.motsImpossible.length; i++) {
            if(mot === this.motsImpossible[i]) {
                return true;
            }
        }
        return false;
    }

    public ajouterMotImpossible(mot: string) {
        this.motsImpossible.push(mot);
    }

    public estTrouve() {
        this.etatEmplacementMot = EtatEmplacementMot.Trouve;
    }

    public aEteTrouve(): boolean {
        return (this.etatEmplacementMot === EtatEmplacementMot.Trouve) ? true : false;
    }

    public estHorizontal(): boolean {
        return (this.position === Position.Ligne) ? true : false;
    }

    public estVertical(): boolean {
        if(this.position === Position.Colonne) {
            return true;
        }
        return false;
    }

    public copieEmplacement(): EmplacementMot {
        
       let newEmplacement = new EmplacementMot(this.caseDebut.copieCase(), this.caseFin.copieCase());
       for(let i = 0; i < this.motsImpossible.length; i++) {
           newEmplacement.motsImpossible[i] = this.motsImpossible[i];
       }
       newEmplacement.grandeur = this.grandeur;
       newEmplacement.position = this.position;

       
       return newEmplacement;
    }

    public obtenirPosition(): Position {
        return this.position;
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

    public attribuerGuidIndice(guid: string): void {
        this.GuidIndice = guid;
    }
    public obtenirGuidIndice(): string {
        return this.GuidIndice;
    }
}
