
import { Mot } from './Mot';
import { Case, EtatCase } from './Case';


export const DIMENSION_LIGNE = 10;
export const DIMENSION_COLONNE = 10;

export enum EtatMotCroise{
    vide,
    encours,
    complet
}

export enum Difficulte{
    facile,
    moyen,
    difficile
}


export class MotsCroises {
    private mots : Mot[];
    private cases:Case[][] = new Array();
    private etat : EtatMotCroise;
    private difficulte : Difficulte;

    public constructor (){

        // Instancie la grille vide sans espace noir.
        for(let i:number = 0; i < 10; i++) {
            this.cases[i] = [];
            for(let j:number = 0; j < 10; j++) {                
                let caseBlanche = new Case(i,j, EtatCase.vide);
                this.cases[i][j] = caseBlanche;
            }
        }

    }

    public estComplete(): boolean {
        return true;
    }

    public validerMot(): boolean {
        return true;
    } 

    public getCase(): Case[][] {
        return this.cases;
    }

    
    public changerEtatCase(etatCase:EtatCase, x:number, y:number): void{

         this.cases[x][y].setEtat(etatCase);

    }

}
