import { Score } from './../tableauScore/Score.model';
import * as THREE from 'three';
import { NgForm } from '@angular/forms';
export class Piste {
    public nombreFoisJouee: number;
    public coteAppreciation: number;
    public meilleursTemps: Score[] = [];
    public vignette: string;

    constructor(public nom: string,
        public typeCourse: string,
        public description: string,
        public listepositions: THREE.Vector3[],
        public id?: number) {
        this.nombreFoisJouee = 0;
        this.coteAppreciation = 0;
        for (let i = 0; i < 5; i++) {
            this.meilleursTemps[i] = new Score('anas', '4min 0' + i + 's');
        }
        this.vignette = 'https://thumbs.dreamstime.com/z/cartoon-racing-map-game-49708152.jpg';
    }

    public modifierAttribut(form: NgForm, listePosition: any[]): void {
        this.typeCourse = form.value.typeCourse;
        this.description = form.value.description;
        this.listepositions = listePosition;
    }

    public modifieAttribut(coteAppreciation: number, nombreFoisJouee: number, meilleursTemps: Score[], vignette: string): void {
        this.coteAppreciation = coteAppreciation;
        this.nombreFoisJouee = nombreFoisJouee;
        for (let i = 0; i < meilleursTemps.length; i++) {
            this.meilleursTemps[i] = new Score(meilleursTemps[i].nom, meilleursTemps[i].valeur);
        }
        this.vignette = vignette;
    }


}
