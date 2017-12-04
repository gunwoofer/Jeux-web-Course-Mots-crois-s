import { Voiture } from './../voiture/Voiture';
import { Score } from './../tableauScore/score.model';
import * as THREE from 'three';
import { NgForm } from '@angular/forms';
import { ElementDePiste } from '../elementsPiste/ElementDePiste';
import { FonctionMaths } from '../fonctionMathematiques';
import { POSITION_OBSTACLE_EN_Z } from '../constant';

export class Piste {
    public static longueurPiste = 0;

    public nombreFoisJouee: number;
    public coteAppreciation: number[];
    public meilleursTemps: Score[] = [];
    public coteMoyenne: number;
    public vignette: string;

    public static genererPositionAleatoire(listePosition: THREE.Vector3[], estUnAccelerateur: boolean): THREE.Vector3 {
        const segmentAleatoire = this.genererSegmentAleatoire(listePosition);
        const pointDebut = segmentAleatoire[0];
        const pointFin = segmentAleatoire[1];

        const x = (estUnAccelerateur) ? FonctionMaths.trouverXAleatoire(pointDebut.x,
                                                                        FonctionMaths.obtenirMoitieEntre2points(pointDebut.x, pointFin.x))
                                      : FonctionMaths.trouverXAleatoire(pointDebut.x, pointFin.x);

        const pente = FonctionMaths.calculerPenteDroite(pointDebut, pointFin);
        const y = pente * x + FonctionMaths.calculerOrdonneeALOrigine(pointDebut, pente);

        return new THREE.Vector3(x, y, POSITION_OBSTACLE_EN_Z);
    }

    private static genererSegmentAleatoire(listePoints: THREE.Vector3[]): THREE.Vector3[] {
        const pointAleatoire = Math.floor(Math.random() * (listePoints.length - 2)) + 1;
        return [listePoints[pointAleatoire], listePoints[pointAleatoire + 1]];
    }

    constructor(public nom: string,
        public typeCourse: string,
        public description: string,
        public listepositions: THREE.Vector3[],
        public listeElementsDePiste: ElementDePiste[],
        public id?: number) {
        this.nombreFoisJouee = 0;
        this.coteAppreciation = [];
        this.meilleursTemps = [];
        this.vignette = 'https://thumbs.dreamstime.com/z/cartoon-racing-map-game-49708152.jpg';
        Piste.longueurPiste = this.obtenirLongueurPiste();
    }

    public gererElementDePiste(listeVoitures: Voiture[]): void {
        for (const voiture of listeVoitures) {
            for (const element of this.listeElementsDePiste) {
                if (voiture.raycasterCollisionDroit.intersectObject(element.obtenirMesh(), true).length !== 0
                    || voiture.raycasterCollisionGauche.intersectObject(element.obtenirMesh(), true).length !== 0 ) {
                    if (!element.antirebond) {
                        element.effetSurObstacle(voiture);
                        element.antirebond = true;
                    }
                } else {
                    element.antirebond = false;
                }
            }
        }
    }

    public ajouterElementPiste(elementPiste: ElementDePiste): void {
        this.listeElementsDePiste.push(elementPiste);
    }

    public obtenirElementsPiste(): ElementDePiste[] {
        return this.listeElementsDePiste;
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
            this.coteMoyenne = Math.floor(somme / nombreElement);
        }
    }
}
