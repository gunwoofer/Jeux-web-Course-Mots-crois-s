import * as THREE from 'three';

export const REAJUSTEMENT_SKYBOX = 0.2;

export class Skybox {

    public emplacementAleatoire(range: number): number {
        return Math.floor(Math.random() * range + 1) - 1;
    }

    private chargerTexture(emplacementImage: string): THREE.MeshBasicMaterial[] {
        const loader = new THREE.TextureLoader();
        const orientations = ['front', 'back', 'top', 'bottom', 'right', 'left'];
        const typeImage = '.png';
        const materiels = [];
        for (let i = 0; i < 6; i++) {
            const texture = loader.load(emplacementImage + orientations[i] + typeImage);
            materiels.push(
                new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.BackSide
                })
            );
        }
        return materiels;
    }

    public creerSkybox(emplacement: string): THREE.Mesh {
        const geometrie = new THREE.CubeGeometry(1500, 1500, 1500);
        const materiels = this.chargerTexture(emplacement);
        const materiel = new THREE.MultiMaterial(materiels);
        const skybox = new THREE.Mesh(geometrie, materiel);
        skybox.name = 'Skybox';
        skybox.rotateX(REAJUSTEMENT_SKYBOX);
        return skybox;
    }
}
