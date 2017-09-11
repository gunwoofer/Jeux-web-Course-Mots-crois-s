
import { Mot } from './Mot';
import { Case } from './Case';


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
    private cases:Case[] = new Array(100);
    private etat : EtatMotCroise;
    private difficulte : Difficulte;

    public constructor (){

    }

    public estComplete(): boolean {
        return true;
    }

    public validerMot(): boolean {
        return true;
    } 

    public getCase(): Case[] {
        return this.cases;
    }

    public ajouterCase(caseAAjouter: Case): void{
        this.cases.push(caseAAjouter);
    }

}
