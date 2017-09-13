import { CasePleine } from './CasePleine';


export enum Rarete {
    commun,
    nonCommun
}


export class Mot {
    private cases : CasePleine[];
    private rarete : Rarete;
    private indice : string[];
    
    public constructor(cases:CasePleine[]){
        this.cases = cases;
    }

    public simplifierMot(): string{
        return "";
    }

    public obtenirLettre(position:number): CasePleine {
        return this.cases[position];
    } 
}