import { Injectable } from '@angular/core';
import {
    NOMBRE_SOMMETS_LARGEUR, NOMBRE_SOMMETS_LONGUEUR, ORIGINE, COULEUR_ROUGE, SURFACE_HORS_PISTE_TEXTURE,
    ORIENTATION_Z, ANISTROPY, POSITION_RELIEF_PAR_RAPPORT_Z, REPETITION_TEXTURE_SURFACE_HORS_PISTE
} from './../constant';
import * as THREE from 'three';


@Injectable()
export class SurfaceHorsPiste {

    private largeurMonde;
    private longueurMonde;
    private piste: THREE.Mesh[];
    private rayCaster: THREE.Raycaster;
    public terrain: THREE.Mesh;

    constructor(largeurMonde: number, longueurMonde: number, segmentsPiste: THREE.Mesh[]) {
        this.largeurMonde = largeurMonde;
        this.longueurMonde = longueurMonde;
        this.piste = segmentsPiste;
        this.terrain = this.genererTerrain();
    }

    private genererTerrain(): THREE.Mesh {
        const terrain = new THREE.Mesh(this.generationGeometrie(), this.generationMaterial());
        terrain.position.z -= 1;
        return terrain;
    }

    private generationGeometrie(): THREE.PlaneGeometry {
        const geometrie = new THREE.PlaneGeometry(this.largeurMonde, this.longueurMonde, NOMBRE_SOMMETS_LARGEUR, NOMBRE_SOMMETS_LONGUEUR);
        for (let dimension = 0; dimension < NOMBRE_SOMMETS_LARGEUR * NOMBRE_SOMMETS_LONGUEUR; dimension++) {
            if (geometrie.vertices[dimension] !== undefined) {
                this.manipulationGeometrie(dimension, geometrie);
            }
        }
        return geometrie;
    }

    private manipulationGeometrie(dimension: number, geometrie: THREE.PlaneGeometry): void {
        if (this.estSurLaPiste(geometrie.vertices[dimension])) {
            geometrie.vertices[dimension].z = POSITION_RELIEF_PAR_RAPPORT_Z;
        } else {
            geometrie.vertices[dimension].z = Math.random() * -POSITION_RELIEF_PAR_RAPPORT_Z;
        }
    }

    private generationMaterial(): THREE.MeshPhongMaterial {
        const materiel = new THREE.MeshPhongMaterial();
        const loader = new THREE.TextureLoader();
        loader.load(SURFACE_HORS_PISTE_TEXTURE, (txt: THREE.Texture) => {
            txt.wrapS = THREE.RepeatWrapping;
            txt.wrapT = THREE.RepeatWrapping;
            txt.anisotropy = ANISTROPY;
            txt.repeat.set(REPETITION_TEXTURE_SURFACE_HORS_PISTE, REPETITION_TEXTURE_SURFACE_HORS_PISTE);
            materiel.color.set(COULEUR_ROUGE);
            materiel.map = txt;
            materiel.needsUpdate = true;
        });
        return materiel;
    }

    private estSurLaPiste(sommet: THREE.Vector3): boolean {
        this.genererRayCasterVersLeBas(sommet);
        for (const segment of this.piste) {
            if (this.rayCaster.intersectObject(segment).length !== 0) {
                return true;
            }
        }
        return false;
    }

    private genererRayCasterVersLeBas(position: THREE.Vector3): void {
        const vecteurVersLeBas = new THREE.Vector3(ORIGINE, ORIGINE, ORIENTATION_Z);
        this.rayCaster = new THREE.Raycaster(position, vecteurVersLeBas);
    }


}



