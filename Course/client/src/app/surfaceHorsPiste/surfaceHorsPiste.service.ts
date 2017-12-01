import { Injectable } from '@angular/core';
import {
    NOMBRE_SOMMETS_LARGEUR, LONGUEUR_SURFACE_HORS_PISTE, NOMBRE_SOMMETS_LONGUEUR, ORIGINE, COULEUR_ROUGE, SURFACE_HORS_PISTE_TEXTURE,
    ORIENTATION_Z, ANISTROPY, POSITION_RELIEF_PAR_RAPPORT_Z, REPETITION_TEXTURE_SURFACE_HORS_PISTE, LARGEUR_SURFACE_HORS_PISTE
} from './../constant';
import * as THREE from 'three';


@Injectable()
export class SurfaceHorsPiste {

    public static genererTerrain(segmentsPiste: THREE.Mesh[]): THREE.Mesh {
        const terrain = new THREE.Mesh(this.generationGeometrie(segmentsPiste), this.generationMaterial());
        terrain.position.z -= 1;
        return terrain;
    }

    private static generationGeometrie(segmentsPiste: THREE.Mesh[]): THREE.PlaneGeometry {
        const geometrie = new THREE.PlaneGeometry(LONGUEUR_SURFACE_HORS_PISTE,
            LARGEUR_SURFACE_HORS_PISTE, NOMBRE_SOMMETS_LARGEUR, NOMBRE_SOMMETS_LONGUEUR);
        for (let dimension = 0; dimension < NOMBRE_SOMMETS_LARGEUR * NOMBRE_SOMMETS_LONGUEUR; dimension++) {
            if (geometrie.vertices[dimension] !== undefined) {
                this.manipulationGeometrie(dimension, geometrie, segmentsPiste);
            }
        }
        return geometrie;
    }

    private static manipulationGeometrie(dimension: number, geometrie: THREE.PlaneGeometry, segmentsPiste: THREE.Mesh[]): void {
        if (this.estSurLaPiste(geometrie.vertices[dimension], segmentsPiste)) {
            geometrie.vertices[dimension].z = POSITION_RELIEF_PAR_RAPPORT_Z;
        } else {
            geometrie.vertices[dimension].z = Math.random() * -POSITION_RELIEF_PAR_RAPPORT_Z;
        }
    }

    private static generationMaterial(): THREE.MeshPhongMaterial {
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

    private static estSurLaPiste(sommet: THREE.Vector3, segmentsPiste: THREE.Mesh[]): boolean {
        for (const segment of segmentsPiste) {
            if (this.genererRayCasterVersLeBas(sommet).intersectObject(segment).length !== 0) {
                return true;
            }
        }
        return false;
    }

    private static genererRayCasterVersLeBas(position: THREE.Vector3): THREE.Raycaster {
        return new THREE.Raycaster(position, new THREE.Vector3(ORIGINE, ORIGINE, ORIENTATION_Z));
    }


}



