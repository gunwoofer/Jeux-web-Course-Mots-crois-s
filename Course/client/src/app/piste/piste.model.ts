import * as THREE from 'three';


export class Piste {

    public nombreFoisJouee: number;
    public coteAppreciation: number;
    public meilleursScore: Float32Array;
    constructor(public nom: string, public typeCourse: string, public description: string, public listePoints?: THREE.Points[]) {
        this.nombreFoisJouee = 0;
        this.coteAppreciation = 0;
    }

}
