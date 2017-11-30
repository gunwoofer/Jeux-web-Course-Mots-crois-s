import { Injectable } from '@angular/core';
import {
    NOMBRE_SOMMETS_LARGEUR, NOMBRE_SOMMETS_LONGUEUR, ORIGINE,
    ORIENTATION_Z, ANISTROPY, POSITION_RELIEF_PAR_RAPPORT_Z
} from './../constant';
import * as THREE from 'three';

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
        const geometrie = this.generationGeometrie();
        const materiel = this.generationMaterial();
        const terrain = new THREE.Mesh(geometrie, materiel);
        return terrain;
    }

    public generationGeometrie(): THREE.PlaneGeometry {
        const geometrie = new THREE.PlaneGeometry(this.largeurMonde, this.longueurMonde, NOMBRE_SOMMETS_LARGEUR, NOMBRE_SOMMETS_LONGUEUR);
        for (let i = 0; i < NOMBRE_SOMMETS_LARGEUR * NOMBRE_SOMMETS_LONGUEUR; i++) {
            if (geometrie.vertices[i] !== undefined) {
                if (this.estSurLaPiste(geometrie.vertices[i])) {
                    geometrie.vertices[i].z = POSITION_RELIEF_PAR_RAPPORT_Z;
                } else {
                    geometrie.vertices[i].z = Math.random() * -POSITION_RELIEF_PAR_RAPPORT_Z;
                }
            }
        }
        return geometrie;
    }

    public generationMaterial(): THREE.MeshPhongMaterial {
        const materiel = new THREE.MeshPhongMaterial();
        const loader = new THREE.TextureLoader();
        loader.load('../../assets/textures/texturerock.jpg', (txt) => {
            txt.wrapS = THREE.RepeatWrapping;
            txt.wrapT = THREE.RepeatWrapping;
            txt.anisotropy = ANISTROPY;
            txt.repeat.set(10, 10);
            materiel.color.set('red');
            materiel.map = txt;
            materiel.needsUpdate = true;
        });
        return materiel;
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
        const vecteurVersLeBas = new THREE.Vector3(ORIGINE, ORIGINE, ORIENTATION_Z);
        this.rayCaster = new THREE.Raycaster(position, vecteurVersLeBas);
    }


}



