import { Injectable } from '@angular/core';
import * as THREE from 'three';

// Precision du relief
export const NOMBRE_SOMMETS_LARGEUR = 50;
export const NOMBRE_SOMMETS_LONGUEUR = 50;

@Injectable()
export class SurfaceHorsPiste {

    private largeurMonde;
    private longueurMonde;
    private piste: THREE.Mesh[];
    private rayCaster: THREE.Raycaster;

    constructor(largeurMonde: number, longueurMonde: number, segmentsPiste: THREE.Mesh[]) {
        this.largeurMonde = largeurMonde;
        this.longueurMonde = longueurMonde;
        this.piste = segmentsPiste;
    }

    public genererTerrain(): THREE.Mesh {
        const geometrie = new THREE.PlaneGeometry(this.largeurMonde, this.longueurMonde, NOMBRE_SOMMETS_LARGEUR, NOMBRE_SOMMETS_LONGUEUR);
        for (let i = 0; i < NOMBRE_SOMMETS_LARGEUR * NOMBRE_SOMMETS_LONGUEUR; i++) {
            if (geometrie.vertices[i] !== undefined) {
                if (this.estSurLaPiste(geometrie.vertices[i])) {
                    geometrie.vertices[i].z = -5;
                } else {
                    geometrie.vertices[i].z = Math.random() * 5;
                }
            }
        }
        const texture = THREE.ImageUtils.loadTexture('../../assets/textures/montagnes.jpg');
        const materiel = new THREE.MeshLambertMaterial({ map : texture });
        const terrain = new THREE.Mesh(geometrie, materiel);
        return terrain;
    }

    public estSurLaPiste(sommet: THREE.Vector3): boolean {
        this.genererRayCasterVersLeBas(sommet);
        for (const segment of this.piste) {
            if (this.rayCaster.intersectObject(segment).length !== 0) {
                return true;
            }
        }
        return false;
    }

    public genererRayCasterVersLeBas(position: THREE.Vector3): void {
        const vecteurVersLeBas = new THREE.Vector3(0, 0, -1);
        // position.z += 1;
        this.rayCaster = new THREE.Raycaster(position, vecteurVersLeBas);
    }


}



