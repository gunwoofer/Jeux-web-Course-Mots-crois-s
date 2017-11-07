import * as THREE from 'three';
import { NgForm } from '@angular/forms';
import { Segment } from './segment.model';

export class Piste {
    public static longueurPiste = 0;

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

        Piste.longueurPiste = this.obtenirLongueurPiste();
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
        let Segment: Segment;
        this.segmentsPisteVisuel = Segment.chargerSegmentsDePiste(this);
    }

    public obtenirSegments3D(): THREE.Mesh[] {
        return this.segmentsPisteVisuel;
    }

    public obtenirLongueurPiste(): number {
        let distanceX: number;
        let distanceY: number;
        let distanceTotale = 0;

        for (let i = 1; i < this.listepositions.length; i++) {
            distanceX = this.listepositions[i].x - this.listepositions[i - 1].x;
            distanceY = this.listepositions[i].y - this.listepositions[i - 1].y;

            distanceTotale += Math.pow(Math.pow(distanceX, 2) + Math.pow(distanceY, 2), 0.5);
        }

        return distanceTotale;
    }
}
