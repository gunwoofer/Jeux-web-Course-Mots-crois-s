export enum DifficulteDefinition {
    PremiereDefinition,
    DefinitionAlternative
}

export class Indice {

    private difficulteDefinition: DifficulteDefinition;
    public definitions: string[] = new Array();

    constructor(definitions: string[]) {
        this.definitions = definitions;

    }

    public obtenirDifficulteDefinition(): DifficulteDefinition {
        return this.difficulteDefinition;
    }

    public setDifficulteDefinition(difficultedefinition: DifficulteDefinition): void {
        this.difficulteDefinition = difficultedefinition;
    }

    public obtenirDefinition(difficulte: DifficulteDefinition): string {
        if(difficulte === DifficulteDefinition.PremiereDefinition){
            return this.definitions[0];
        } else{
            const nombreDefinitions: number = this.definitions.length;
            const n: number = this.nombreAleatoireEntre1Etn(nombreDefinitions);
            return this.definitions[n];
        }
    }

    private nombreAleatoireEntre1Etn(n: number): number{
        return Math.floor((Math.random() * n) + 1);
    }
}
