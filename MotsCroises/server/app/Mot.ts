import { CasePleine } from './CasePleine';
import { Indice, DifficulteDefinition } from './Indice';

export enum Rarete {
    commun,
    nonCommun
}


export class Mot {
    private lettres : string;
    private rarete : Rarete;
    private indice : Indice;
    
    public constructor(lettres:string){
        this.lettres = lettres.toUpperCase();
    }

    public estUneLettreValide(position:number):boolean{
        if((this.lettres[position] === "-") || (this.lettres[position] === "'")) {
            return false;
        }

        return true;
    } 

    public setRarete(rarete:Rarete):void {
        this.rarete = rarete;
    }
    

    public obtenirIndice(): Indice {
        return this.indice;
    }

    public obtenirRarete(): Rarete {
        return this.rarete;
    }

    public obtenirLettreSimplifie(position:number):string{
        return this.lettres[position].normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    }

    public obtenirLettre(position:number): string {
        return this.lettres.charAt(position);
    } 

    public obtenirLettres():string{
        return this.lettres;
    }
}