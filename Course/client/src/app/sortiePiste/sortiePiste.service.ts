import { DeplacementService } from './../generateurPiste/deplacement.service';
import { ORIGINE, ORIENTATION_Z } from './../constant';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';


@Injectable()
export class SortiePisteService {

    private segmentOuReapparaitre: THREE.Mesh;

    constructor() {
        this.segmentOuReapparaitre = new THREE.Mesh();
    }

    public gererSortiePiste(voiture: Voiture, listeSegments: THREE.Mesh[]): void {
        if (!this.estSurLaPiste(voiture.obtenirVoiture3D(), listeSegments)) {
            this.ramenerVoitureDernierSegment(voiture);
            DeplacementService.reduireVitesseSortiePiste(voiture);
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
        return segment.localToWorld(this.calculerMilieuSegment(segment));
    }

    private calculerMilieuSegment(segment: THREE.Mesh): THREE.Vector3 {
        segment.geometry.computeBoundingBox();
        return new THREE.Vector3(
            (segment.geometry.boundingBox.max.x + segment.geometry.boundingBox.min.x) / 2,
            (segment.geometry.boundingBox.max.y + segment.geometry.boundingBox.min.y) / 2,
            (segment.geometry.boundingBox.max.z + segment.geometry.boundingBox.min.z) / 2
        );
    }
}
