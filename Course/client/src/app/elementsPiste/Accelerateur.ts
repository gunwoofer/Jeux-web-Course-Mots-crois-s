import { ElementDePiste } from './ElementDePiste';


export class Accelerateur extends ElementDePiste {

    constructor(x: number, y: number, z: number) {
        super(x, y, z);

    }

    public effetApresObstacle(): void {

    }

    public effetSurObstacle(): void {
        throw new Error('Method not implemented.');
    }

}
