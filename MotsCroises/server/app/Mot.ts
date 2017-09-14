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
        this.lettres = lettres;
    }

    public simplifierMot(): string{
        return "";
    }

    public obtenirLettre(position:number): string {
        return this.lettres.charAt(position);
    } 
}