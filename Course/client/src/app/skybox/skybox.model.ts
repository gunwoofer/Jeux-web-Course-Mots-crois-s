import * as THREE from 'three';

export class Skybox {
    private emplacementsImages: string[] = [];

    constructor () {
        // Source : http://www.custommapmakers.org/skyboxes.php
        this.emplacementsImages.push('../../assets/textures/darkskies/darkskies_');
        this.emplacementsImages.push('../../assets/textures/city/pr_');
        this.emplacementsImages.push('../../assets/textures/miramar/miramar_');
        this.emplacementsImages.push('../../assets/textures/hills/hills_');
        this.emplacementsImages.push('../../assets/textures/sunset/sunset_');
    }

    private obtenirSkyboxAleatoire(): string {
        // Indice entre 1 - 1 et 5 - 1 => entre 0 et 4
        const indice = Math.floor(Math.random() * 5 + 1) - 1;
        console.log(indice);
        return this.emplacementsImages[indice];
    }

    public creerSkybox(): THREE.Mesh {
        const emplacementImage = this.obtenirSkyboxAleatoire();
        // const orientations = ['droite', 'gauche', 'devant', 'derriere', 'plafond', 'sol'];
        const orientations = ['ft', 'lf', 'up', 'dn', 'bk', 'rt'];
        const typeImage = '.jpg';
        const geometrie = new THREE.CubeGeometry( 500, 500, 500 );
        const materiels = [];
        for (let i = 0; i < 6; i++) {
            const loader = new THREE.TextureLoader();
            console.log('loading file...');
            console.log(emplacementImage + orientations[i] + typeImage);
            const texture = loader.load(emplacementImage + orientations[i] + typeImage);
            materiels.push(
                new THREE.MeshBasicMaterial({
                    map: texture,
                    side: THREE.BackSide
                })
            );
        }
        const materiel = new THREE.MeshFaceMaterial(materiels);
        const skybox = new THREE.Mesh(geometrie, materiel);
        skybox.position.set(0, 0, 0);
        // Rotate pour avoir le sol de la skybox au bon endroit par rapport à la piste
        // skybox.rotateX(1.5708);
        return skybox;
    }
}
