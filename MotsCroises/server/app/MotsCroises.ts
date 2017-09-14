
import { Mot } from './Mot';
import { Case, EtatCase } from './Case';
import { EmplacementMot } from './EmplacementMot';


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
    private emplacementMots:EmplacementMot[] = new Array();

    private cases:Case[][] = new Array();

    private etat : EtatMotCroise;
    private difficulte : Difficulte;
    
    private nombreMotsSurLigne: number[] = new Array(DIMENSION_LIGNE);
    private nombreMotsSurColonne: number[] = new Array(DIMENSION_COLONNE);

    public constructor (){

        // Instancie la grille vide sans espace noir.
        for(let i:number = 0; i < DIMENSION_LIGNE; i++) {
            this.cases[i] = [];
            this.nombreMotsSurLigne[i] = 0;

            for(let j:number = 0; j < DIMENSION_COLONNE; j++) {                
                let caseBlanche = new Case(i,j, EtatCase.vide);
                this.nombreMotsSurColonne[j] = 0;
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

    public obtenirCases(): Case[][] {
        return this.cases;
    }

    public obtenirCase(x:number, y:number):Case{
        return this.cases[x][y];
    }

    
    public changerEtatCase(etatCase:EtatCase, x:number, y:number): void{

         this.cases[x][y].setEtat(etatCase);

    }

    public ajouterEmplacementMot(emplacementMot:EmplacementMot) {
        this.emplacementMots.push(emplacementMot);
    }

    public existeEmplacementMot(xDepart:number, yDepart:number, xFin:number, yFin:number):boolean {

        for(let emplacementMotCourant of this.emplacementMots) {
            let caseDebut:Case = emplacementMotCourant.obtenirCaseDebut();
            let caseFin:Case = emplacementMotCourant.obtenirCaseFin();
            
            if  (    
                    (caseDebut.getX() === xDepart) &&
                    (caseDebut.getY() === yDepart) &&
                    (caseFin.getX() === xDepart) &&
                    (caseFin.getY() === yDepart)         
                )
                return true;

        }

        return false;

    }

    public ajouterMot(mot:Mot, xDepart:number, yDepart:number, xFin:number, yFin:number) {

        this.mots.push(mot);
        
        
        let positionDansLeMot:number = 0;

        // Commenter jusqu'à avoir le débogueur fonctionnel.
       // if(this.existeEmplacementMot(xDepart, yDepart, xFin, yFin))
        //{
            // Cas du mot à l'horizontal.
            if(xDepart === xFin)
            {
                for(let caseCourante of this.cases[xDepart])
                {
                    if(this.dansLaLimiteDuMot(caseCourante.getY(), yDepart, yFin)) {
                        caseCourante.remplirCase(mot.obtenirLettre(positionDansLeMot));                        
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
                        this.cases[i][yDepart].remplirCase(mot.obtenirLettre(positionDansLeMot));
                    }
                }

                this.nombreMotsSurColonne[yDepart]++;
            }
       // }
    }

    public obtenirNombreMotsSurLigne(ligne:number):number {

        if(ligne >= DIMENSION_LIGNE) {
            return -1;
        }

        return this.nombreMotsSurLigne[ligne];
    }

    public obtenirNombreMotsSurColonne(ligne:number) {

        if(ligne >= DIMENSION_LIGNE) {
            return -1;
        }

        return this.nombreMotsSurColonne[ligne];
    }

    public obtenirPositionsEmplacementsVides():EmplacementMot[]{
        return this.emplacementMots;
    }

    public dansLaLimiteDuMot(caseCourante:number, debutY:number, finY:number):boolean {

        if(caseCourante >= debutY && caseCourante <= finY)
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
