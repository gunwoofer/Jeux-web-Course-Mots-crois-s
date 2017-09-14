

export enum DifficulteDefinition {
    PremiereDefinition,
    DefinitionAlternative
}


export class Indice {

    public definitions : string[];
    private rarete: DifficulteDefinition;
    
    constructor() {

    }

    public obtenirRarete(): DifficulteDefinition {
        return this.rarete;
    }

    public obtenirDefinition(difficulte:DifficulteDefinition): string {
        if(difficulte == DifficulteDefinition.PremiereDefinition){
            return this.definitions[0];
        }
        else{
            let nombreDefinitions:number = this.definitions.length;
            let n:number = this.nombreAleatoireEntre1Etn(nombreDefinitions);
            return this.definitions[n];
        }
    }

    private nombreAleatoireEntre1Etn(n:number):number{
        return Math.floor((Math.random() * n) + 1);
    }

}