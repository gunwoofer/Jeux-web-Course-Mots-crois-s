import * as THREE from 'three';
import { NgForm } from '@angular/forms';
import { Segment } from './segment.model';

export class Piste {
    public nombreFoisJouee: number;
    public coteAppreciation: number;
    public meilleursTemps: string[] = [];
    public vignette: string;
    private segmentsPisteVisuel: THREE.Mesh[] = [];

    constructor(public nom: string,
        public typeCourse: string,
        public description: string,
        public listepositions: THREE.Vector3[],
        public id?: number) {
        this.nombreFoisJouee = 0;
        this.coteAppreciation = 0;
        for (let i = 0; i < 5; i++) {
            this.meilleursTemps[i] = '4min 0' + i + 's';
        }
        this.vignette = 'https://thumbs.dreamstime.com/z/cartoon-racing-map-game-49708152.jpg';
    }

    public modifierAttribut(form: NgForm, listePosition: any[]): void {
        this.typeCourse = form.value.typeCourse;
        this.description = form.value.description;
        this.listepositions = listePosition;
    }

    public modifieAttribut(coteAppreciation: number, nombreFoisJouee: number, meilleursTemps: string[], vignette: string): void {
        this.coteAppreciation = coteAppreciation;
        this.nombreFoisJouee = nombreFoisJouee;
        this.meilleursTemps = meilleursTemps;
        this.vignette = vignette;
    }

    public chargerSegments(): void {
        this.segmentsPisteVisuel = Segment.chargerSegmentsDePiste(this);
    }

    public obtenirSegments3D(): THREE.Mesh[] {
        return this.segmentsPisteVisuel;
    }
}
