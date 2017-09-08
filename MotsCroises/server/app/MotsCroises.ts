
import { Mot } from './Mot';
import { Case } from './Case';


export const DIMENSION_LIGNE = 10;
export const dDIMENSION_COLONNE = 10;

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
    private case : Case[];
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


}
