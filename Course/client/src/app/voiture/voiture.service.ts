import { Deplacement } from './../generateurPiste/deplacement';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class Voiture {
    public voiture: THREE.Mesh;
    public positionVoiture: THREE.Vector3;
    private deplacement = new Deplacement();
    public vitesse: number = 0;

    constructor(objetVoiture: THREE.Mesh) { }

    public creerVoiture(): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const loader = new THREE.TextureLoader();
        const texture = loader.load('../../assets/textures/clouds.jpg');

        const material = new THREE.MeshBasicMaterial({ color: 'white', overdraw: 0.5, map: texture });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.y = 10;
        cube.position.x = 0;
        cube.position.z = 0;
        this.voiture = cube;
        return this.voiture;
    }

    public obtenirObjetVoiture3D(): THREE.Mesh {
        return this.voiture;
    }

    public obtenirPositionVoiture(): THREE.Vector3 {
        this.positionVoiture = new THREE.Vector3(this.voiture.position.x, this.voiture.position.y, this.voiture.position.z);
        return this.positionVoiture;
    }

}
