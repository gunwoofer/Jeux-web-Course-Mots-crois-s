import * as THREE from 'three';

export class Skybox {

    private emplacementAleatoire(): number {
        return Math.floor(Math.random() * 5 + 1) - 1;
    }

    private obtenirSkyboxAleatoire(emplacements: string[]): string {
        const indice = this.emplacementAleatoire();
        return emplacements[indice];
    }

    private chargerTexture(emplacements: string[]): THREE.MeshBasicMaterial[] {
        const loader = new THREE.TextureLoader();
        const emplacementImage = this.obtenirSkyboxAleatoire(emplacements);
        const orientations = ['front', 'back', 'top', 'down', 'right', 'left'];
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

    public creerSkybox(emplacements: string[]): THREE.Mesh {
        const geometrie = new THREE.CubeGeometry(500, 500, 500);
        const materiels = this.chargerTexture(emplacements);
        const materiel = new THREE.MeshFaceMaterial(materiels);
        const skybox = new THREE.Mesh(geometrie, materiel);
        return skybox;
    }
}
