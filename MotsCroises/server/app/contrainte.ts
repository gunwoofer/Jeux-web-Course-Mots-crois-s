export class Contrainte {
    private lettreContrainte: string;
    private positionContrainte: number;

    constructor(lettre: string, pos: number) {
        this.lettreContrainte = lettre;
        this.positionContrainte = pos;

    }

    public obtenirLettre(): string {
        return this.lettreContrainte;
    }

    public obtenirPositionContrainte(): number {
        return this.positionContrainte;
    }
}
