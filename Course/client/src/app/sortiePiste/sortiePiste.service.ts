import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';


@Injectable()
export class SortiePisteService {
    private rayCaster: THREE.Raycaster;
    private listeSegments: THREE.Mesh[];
    private estSurPiste: boolean;
    private segmentOuReapparaitre: THREE.Mesh;

    constructor(piste: THREE.Mesh[]) {
        this.listeSegments = piste;
    }

    public gererSortiePiste(voiture: Voiture): void {
        this.estSurLaPiste(voiture.obtenirVoiture3D());
        if (!this.estSurPiste) {
            this.ramenerVoitureDernierSegment(voiture);
            voiture.reduireVitesseSortiePiste();
        }
    }

    public ramenerVoitureDernierSegment(voiture: Voiture): void {
        voiture.obtenirVoiture3D().position.x = this.trouverMilieuSegment(this.segmentOuReapparaitre).x;
        voiture.obtenirVoiture3D().position.y = this.trouverMilieuSegment(this.segmentOuReapparaitre).y;
        voiture.obtenirVoiture3D().position.z = 0;
        voiture.ignorerSortiepiste();
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
        // Le raycaster part au dessus de la piste
        voiture.position.z = 0;
        this.rayCaster = new THREE.Raycaster(voiture.position, directionVersLeBas);
    }

    public trouverPointsIntersection(): void {
        for (const segment of this.listeSegments) {
            if (this.rayCaster.intersectObject(segment).length !== 0) {
                this.estSurPiste = true;
                this.segmentOuReapparaitre = segment;
                return;
            }
        }
        this.estSurPiste = false;
        return;
    }

    public trouverMilieuSegment(segment: THREE.Mesh): THREE.Vector3 {
        const milieu = new THREE.Vector3();
        const geometry = segment.geometry;
        geometry.computeBoundingBox();
        milieu.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
        milieu.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
        milieu.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;
        segment.localToWorld(milieu);
        return milieu;
    }
}
