import { Grille } from './Grille';
import { Guid } from '../../commun/Guid';
import { Niveau } from '../../commun/Niveau';

export enum DifficulteDefinition {
    PremiereDefinition,
    DefinitionAlternative
}

export class Indice {

    public difficulte: DifficulteDefinition;
    public definitions: string[] = new Array();
    public id: string = Guid.generateGUID();

    constructor(definitions: string[]) {
        this.definitions = definitions;

    }

    public copieIndice(): Indice {
        let newIndice = new Indice(this.definitions);
        return newIndice;
    }

    public setDifficulteDefinition(difficulte: DifficulteDefinition): void {
        this.difficulte = difficulte;
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
