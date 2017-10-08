import * as THREE from 'three';

export class Piste {

    public nombreFoisJouee: number;
    public coteAppreciation: number;
    public meilleursTemps: number[] = [];
    constructor(public nom: string, public typeCourse: string, public description: string, public listepositions?: any[]) {
        this.nombreFoisJouee = 0;
        this.coteAppreciation = 0;
        for (let i = 0; i < 5; i++) {
            this.meilleursTemps[i] = 0;
        }
    }

}
