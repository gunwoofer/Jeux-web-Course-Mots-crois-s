import { Position } from './../../../../../MotsCroises/commun/Position';
import { Segment } from './../piste/segment.model';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/voiture.service';
import { Piste } from '../piste/piste.model';



@Injectable()
export class SortiePisteService {
    private rayCaster: THREE.Raycaster;
    private voiture: THREE.Object3D;
    private listeSegments: THREE.Mesh[];
    private estSurPiste: boolean;
    private segmentOuReapparaitre: THREE.Mesh;
    private pointOuReapparaitre: THREE.Vector3;


    constructor(piste: THREE.Mesh[]) {
        this.listeSegments = piste;
    }

    public gererSortiePiste(voiture: THREE.Object3D): void {
        this.estSurLaPiste(voiture);
        if (!this.estSurPiste) {
            // Apparition sur une position arbitraire sans conflits d intersections
            voiture.position.x = 28;
            voiture.position.y = -21;
        }
    }


    public estSurLaPiste(voiture: THREE.Object3D): boolean {
        console.log(voiture);
        this.genererRayCaster(voiture);
        this.trouverPointsIntersection();
        if (this.estSurPiste) {
            return true;
        } else {
            return false;
        }
    }

    public genererRayCaster(voiture: THREE.Object3D): void {
        const directionVersLeBas = new THREE.Vector3(0, 0, -1);
        this.rayCaster = new THREE.Raycaster(voiture.position, directionVersLeBas);
    }

    public trouverPointsIntersection(): void {
        let vertice: any;
        for (const segment of this.listeSegments) {
            if (this.rayCaster.intersectObject(segment).length !== 0) {
               vertice = segment.geometry;
                this.estSurPiste = true;
                this.segmentOuReapparaitre = segment;
                return;
            }
        }
        this.estSurPiste = false;
        return;
    }
}