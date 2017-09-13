
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
    private mots : Mot[] = new Array();
    private nombreMotsSurLigne: number[] = new Array(DIMENSION_LIGNE);
    private nombreMotsSurColonne: number[] = new Array(DIMENSION_COLONNE);
    private cases:Case[][] = new Array();
    private etat : EtatMotCroise;
    private difficulte : Difficulte;

    public constructor (){

        // Instancie la grille vide sans espace noir.
        for(let i:number = 0; i < DIMENSION_LIGNE; i++) {
            this.cases[i] = [];
            for(let j:number = 0; j < DIMENSION_COLONNE; j++) {                
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

    public ajouterMot(mot:Mot, xDepart:number, yDepart:number, xFin:number, yFin:number) {

        this.mots.push(mot);
        
        
        let positionDansLeMot:number = 0;

        // Cas du mot à l'horizontal.
        if(xDepart === xFin)
        {
            for(let caseCourante of this.cases[xDepart])
            {
                if(this.dansLaLimiteDuMot(caseCourante.getY(), yDepart, yFin)) {
                    caseCourante = mot.obtenirLettre(positionDansLeMot);
                }
            }

            this.nombreMotsSurLigne[xDepart]++;
        }

        // Cas du mot à la vertical.
        if(yDepart === yFin)
        {
            for(let i = 0; i < this.cases.length; i++)
            {
                if(this.dansLaLimiteDuMot(i, xDepart, xFin)) {
                    this.cases[i][yDepart] = mot.obtenirLettre(positionDansLeMot);
                }
            }

            this.nombreMotsSurColonne[yDepart]++;
        }
    }

    public obtenirNombreMotsSurLigne(ligne:number):number {

        if(ligne < DIMENSION_LIGNE) {
            return this.nombreMotsSurLigne[ligne];
        }

        return -1;
    }

    public obtenirNombreMotsSurColonne(ligne:number) {

        if(ligne < DIMENSION_LIGNE) {
            return this.obtenirNombreMotsSurColonne[ligne];
        }

        return -1;
    }

    public dansLaLimiteDuMot(caseCourante:number, debutY:number, finY:number):boolean {

        if(caseCourante >= debutY && caseCourante.getY() <= finY)
            return true; 
        return false;
        
    }

    public obtenirLongueurCases():number {
        return this.cases.length;
    }

    public obtenirHauteurCases():number {
        let nbrCasesY:number = 0;

        for(let casesDeLaLigne of this.cases) {
            if(nbrCasesY != 0 && nbrCasesY !== casesDeLaLigne.length)
                return -1;
            nbrCasesY = casesDeLaLigne.length;
        }

        return nbrCasesY;
    }

}
