import { CasePleine } from './CasePleine';


export enum Rarete {
    commun,
    nonCommun
}


export class Mot {
    private lettres : string;
    private rarete : Rarete;
    private indice : string[];
    
    public constructor(lettres:string){
        this.lettres = lettres.toUpperCase();
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