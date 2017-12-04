import { FonctionMaths } from './../fonctionMathematiques';
import { ORIGINE, ORIENTATION_Z } from './../constant';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';
import { DeplacementVoiture } from '../deplacement/deplacementVoiture';

@Injectable()
export class SortiePisteService {

    private segmentOuReapparaitre: THREE.Mesh;

    constructor() {
        this.segmentOuReapparaitre = new THREE.Mesh();
    }

    public gererSortiePiste(voiture: Voiture, listeSegments: THREE.Mesh[]): void {
        if (!this.estSurLaPiste(voiture.obtenirVoiture3D(), listeSegments)) {
            this.ramenerVoitureDernierSegment(voiture);
            DeplacementVoiture.reduireVitesseSortiePiste(voiture);
        }
    }

    private ramenerVoitureDernierSegment(voiture: Voiture): void {
        voiture.obtenirVoiture3D().position.x = this.trouverMilieuSegment(this.segmentOuReapparaitre).x;
        voiture.obtenirVoiture3D().position.y = this.trouverMilieuSegment(this.segmentOuReapparaitre).y;
        voiture.obtenirVoiture3D().position.z = ORIGINE;
        voiture.ignorerSortiepiste();
    }


    private genererRayCaster(voiture: THREE.Object3D): THREE.Raycaster {
        voiture.position.z = ORIGINE;
        return new THREE.Raycaster(voiture.position,
            new THREE.Vector3(ORIGINE, ORIGINE, ORIENTATION_Z));
    }

    private estSurLaPiste(voiture: THREE.Object3D, listeSegments: THREE.Mesh[]): boolean {
        for (const segment of listeSegments) {
            if (this.genererRayCaster(voiture).intersectObject(segment).length !== 0) {
                this.segmentOuReapparaitre = segment;
                return true;
            }
        }
        return false;
    }

    private trouverMilieuSegment(segment: THREE.Mesh): THREE.Vector3 {
        return segment.localToWorld(FonctionMaths.calculerMilieuRectangle(segment));
    }
}
