import { ElementDePiste } from './ElementDePiste';


export class NidDePoule extends ElementDePiste {

    constructor(x: number, y: number, z: number) {
        super(x, y, z);

    }

    public effetSurObstacle(): void {
        throw new Error('Method not implemented.');
    }

}