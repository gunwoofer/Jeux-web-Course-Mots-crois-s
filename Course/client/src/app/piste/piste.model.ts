import * as THREE from 'three';
import { SegmentDePiste } from './segmentdepiste.model';

export class Piste {
    public segmentsDePiste: SegmentDePiste[] = new Array();

    public nombreFoisJouee: number;
    public coteAppreciation: number;
    public meilleursTemps: number[] = [];

    constructor(public nom: string,
        public typeCourse: string,
        public description: string,
        public listepositions?: THREE.Vector3[],
        public id?: number) {
        this.nombreFoisJouee = 0;
        this.coteAppreciation = 0;

        for (let i = 0; i < 5; i++) {
            this.meilleursTemps[i] = i * 2 + 4;
        }

        if (listepositions !== undefined) {
            for (let i = 1; i < listepositions.length; i++) {
                this.segmentsDePiste.push(new SegmentDePiste(listepositions[i - 1], listepositions[i]));
            }
        }
    }

    public ajouterSegmentDePiste(segmentDePiste: SegmentDePiste): void {
        this.segmentsDePiste.push(segmentDePiste);
    }

    public obtenirVisuelPiste(): THREE.Mesh[] {
        let visuelSegments: THREE.Mesh[] = new Array();

        for (const segmentDePisteCourant of this.segmentsDePiste) {
            visuelSegments.push(segmentDePisteCourant.obtenirVisuelSegment());
        }
        return visuelSegments;
    }
}
