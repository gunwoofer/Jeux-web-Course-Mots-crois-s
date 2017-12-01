import { REAJUSTEMENT_SKYBOX, DIMENSION_CUBE, ORIENTATIONS_SKYBOX, FORMAT_IMAGE, FACE_SKYBOX } from './../constant';
import * as THREE from 'three';

export class Skybox {

    public emplacementAleatoire(range: number): number {
        return Math.floor(Math.random() * range + 1) - 1;
    }

    private chargerTexture(emplacementImage: string): THREE.MeshBasicMaterial[] {
        const materiels = [];
        for (let face = 0; face < FACE_SKYBOX; face++) {
            materiels.push(
                new THREE.MeshBasicMaterial({
                    map: new THREE.TextureLoader().load(emplacementImage + ORIENTATIONS_SKYBOX[face] + FORMAT_IMAGE),
                    side: THREE.BackSide
                })
            );
        }
        return materiels;
    }

    public creerSkybox(emplacement: string): THREE.Mesh {
        const skybox = new THREE.Mesh(
            new THREE.CubeGeometry(DIMENSION_CUBE, DIMENSION_CUBE, DIMENSION_CUBE),
            new THREE.MultiMaterial(this.chargerTexture(emplacement)));
        skybox.rotateX(REAJUSTEMENT_SKYBOX);
        return skybox;
    }
}
