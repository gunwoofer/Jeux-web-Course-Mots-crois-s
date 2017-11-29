import * as THREE from 'three';

export const TAILLE_INDICATEUR = 5;

export class IndicateurVoiture {

    public creerIndicateurVoiture(position: THREE.Vector3): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(TAILLE_INDICATEUR, TAILLE_INDICATEUR, TAILLE_INDICATEUR);
        const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5, visible: false });
        const cubeRetourne = new THREE.Mesh(geometry, material);
        cubeRetourne.position.set(position.x, position.y, position.z);
        cubeRetourne.rotateX(Math.PI / 2);
        return cubeRetourne;
    }
}
