import { Score } from './../tableauScore/score.model';
import * as THREE from 'three';
import { NgForm } from '@angular/forms';

export class Piste {
    public static longueurPiste = 0;

    public nombreFoisJouee: number;
    public coteAppreciation: number[];
    public meilleursTemps: Score[] = [];
    public coteMoyenne: number;
    public vignette: string;

    constructor(public nom: string,
        public typeCourse: string,
        public description: string,
        public listepositions: THREE.Vector3[],
        public id?: number) {
        this.nombreFoisJouee = 0;
        this.coteAppreciation = [];

        for (let i = 0; i < 5; i++) {
            this.meilleursTemps[i] = new Score('anas', '4min 0' + i + 's');
        }
        this.vignette = 'https://thumbs.dreamstime.com/z/cartoon-racing-map-game-49708152.jpg';

        Piste.longueurPiste = this.obtenirLongueurPiste();
    }

    public modifierAttribut(form: NgForm, listePosition: any[]): void {
        this.typeCourse = form.value.typeCourse;
        this.description = form.value.description;
        this.listepositions = listePosition;
    }

    public modifieAttribut(coteAppreciation: number[], nombreFoisJouee: number, meilleursTemps: Score[], vignette: string): void {
        this.coteAppreciation = coteAppreciation;
        this.nombreFoisJouee = nombreFoisJouee;
        for (let i = 0; i < meilleursTemps.length; i++) {
            this.meilleursTemps[i] = new Score(meilleursTemps[i].nom, meilleursTemps[i].valeur);
        }
        this.vignette = vignette;
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

    public calculerLaMoyenneDeVotes(coteAppreciation: number[]): void {
        let chiffre = 0; let somme = 0; let nombreElement = 0;
        if (coteAppreciation.length === 0) {
            this.coteMoyenne = 0;
            return;
        } else {
            for (let i = 0; i < coteAppreciation.length; i++) {
                if (coteAppreciation[i] !== null) {
                    nombreElement++;
                    chiffre = coteAppreciation[i];
                    somme += +chiffre;
                }
            }
            this.coteMoyenne = somme / nombreElement;
        }
    }
}
