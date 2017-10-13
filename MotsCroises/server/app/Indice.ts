import { Guid } from '../../commun/Guid';
import {Niveau} from "../../commun/Niveau";

export enum DifficulteDefinition {
    PremiereDefinition,
    DefinitionAlternative
}

export class Indice {
    private difficulteDefinition: DifficulteDefinition;
    public definitions: string[] = new Array();
    public id: string = Guid.generateGUID();

    constructor(definitions: string[]) {
        this.definitions = definitions;

    }

    public copieIndice(): Indice {
        let newIndice = new Indice(this.definitions);
        newIndice.difficulteDefinition = this.difficulteDefinition;
        return newIndice;
    }


    public obtenirDifficulteDefinition(): DifficulteDefinition {
        return this.difficulteDefinition;
    }

    public setDifficulteDefinition(difficultedefinition: DifficulteDefinition): void {
        this.difficulteDefinition = difficultedefinition;
    }

    public obtenirDefinition(difficulte: Niveau): string {
        if (difficulte === Niveau.facile) {
            return this.definitions[0];
        } else {
            const nombreDefinitions: number = this.definitions.length;
            const n: number = this.nombreAleatoireEntre1Etn(nombreDefinitions);
            return this.definitions[n];
        }
    }

    private nombreAleatoireEntre1Etn(n: number): number {
        return Math.floor((Math.random() * n) + 1);
    }
}
