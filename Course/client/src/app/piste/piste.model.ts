import * as THREE from 'three';
import { SegmentDePiste } from './segmentdepiste.model';
import { NgForm } from '@angular/forms';

export class Piste {
    public segmentsDePiste: SegmentDePiste[] = new Array();
    public nombreFoisJouee: number;
    public coteAppreciation: number;
    public meilleursTemps: number[] = [];

    constructor(public nom: string,
        public typeCourse: string,
        public description: string,
        public listepositions: THREE.Vector3[],
        public id?: number) {
        this.nombreFoisJouee = 0;
        this.coteAppreciation = 0;

        for (let i = 0; i < 5; i++) {
            this.meilleursTemps[i] = i * 2 + 4;
        }
    }

    public ajouterSegmentDePiste(segmentDePiste: SegmentDePiste): void {
        this.segmentsDePiste.push(segmentDePiste);
    }

    public miseAjourSegmentsdePiste(): void {
        for (let i = 1; i < this.listepositions.length; i++) {
            this.ajouterSegmentDePiste(new SegmentDePiste(this.listepositions[i - 1], this.listepositions[i]));
        }
    }

    public obtenirVisuelPiste(): THREE.Mesh[] {
        const visuelSegments: THREE.Mesh[] = new Array();

        for (const segmentDePisteCourant of this.segmentsDePiste) {
            visuelSegments.push(segmentDePisteCourant.obtenirVisuelSegment());
        }
        return visuelSegments;
    }
    public modifierAttribut(form: NgForm, listePosition: any[]): void {
        this.typeCourse = form.value.typeCourse;
        this.description = form.value.description;
        this.listepositions = listePosition;
    }

    public modifieAttribut(coteAppreciation: number, nombreFoisJouee: number, meilleursTemps: number[]): void {
        this.coteAppreciation = coteAppreciation;
        this.nombreFoisJouee = nombreFoisJouee;
        this.meilleursTemps = meilleursTemps;
    }


}
