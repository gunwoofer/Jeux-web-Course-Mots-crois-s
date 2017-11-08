import { Injectable } from '@angular/core';
import * as THREE from 'three';


export const NOMBRE_SOMMETS_LARGEUR = 50;
export const NOMBRE_SOMMETS_LONGUEUR = 50;

@Injectable()
export class SurfaceHorsPiste {

    private largeurMonde;
    private longueurMonde;

    constructor(largeurMonde: number, longueurMonde: number) {
        this.largeurMonde = largeurMonde;
        this.longueurMonde = longueurMonde;
    }

    public genererTerrain(): THREE.Mesh {
        const geometrie = new THREE.PlaneGeometry(NOMBRE_SOMMETS_LARGEUR, NOMBRE_SOMMETS_LONGUEUR, this.largeurMonde, this.longueurMonde);

        for (let i = 0; i < NOMBRE_SOMMETS_LARGEUR * NOMBRE_SOMMETS_LONGUEUR; i++) {
            if (geometrie.vertices[i] !== undefined) {
                geometrie.vertices[i].z = Math.random() * 5;
            }
        }
        const texture = THREE.ImageUtils.loadTexture('../../assets/textures/montagnes.jpg');
        const materiel = new THREE.MeshLambertMaterial({ map : texture });
        const terrain = new THREE.Mesh(geometrie, materiel);
        return terrain;
    }


}



