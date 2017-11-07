import { skyBoxJour } from './skyboxJour';
import * as THREE from 'three';

export class Skybox {
    private emplacementsImages: string[] = skyBoxJour;


    private emplacementAleatoire(): number {
        return Math.floor(Math.random() * 5 + 1) - 1;
    }

    private obtenirSkyboxAleatoire(): string {
        const indice = this.emplacementAleatoire();
        return this.emplacementsImages[indice];
    }

    private chargerTexture(): THREE.MeshBasicMaterial[] {
        const loader = new THREE.TextureLoader();
        const emplacementImage = this.obtenirSkyboxAleatoire();
        const orientations = ['ft', 'bk', 'up', 'dn', 'rt', 'lf'];
        const typeImage = '.jpg';
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

    public creerSkybox(): THREE.Mesh {
        const geometrie = new THREE.CubeGeometry(500, 500, 500);
        const materiels = this.chargerTexture();
        const materiel = new THREE.MeshFaceMaterial(materiels);
        const skybox = new THREE.Mesh(geometrie, materiel);
        return skybox;
    }
}
