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
        // console.log(voiture);

        // this.trouverPointMilieuSegment();
        if (!this.estSurPiste) {
            voiture.position.x = 0;
            voiture.position.y = 0;
        }
    }


    public estSurLaPiste(voiture: THREE.Object3D): boolean {
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
               console.log(vertice.vertices);
                this.estSurPiste = true;
                this.segmentOuReapparaitre = segment;
                return;
            }
        }
        this.estSurPiste = false;
        return;
    }
}
