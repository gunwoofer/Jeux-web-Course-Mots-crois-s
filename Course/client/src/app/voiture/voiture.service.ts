import { Injectable, Component } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class Voiture {
        public voiture: THREE.Mesh;

        constructor (objetVoiture: THREE.Mesh) { }

        public creerVoiture(): void {
        const geometry = new THREE.BoxGeometry( 10, 10, 10);
        const loader = new THREE.TextureLoader();
        const texture = loader.load('../../assets/textures/clouds.jpg');

        const material = new THREE.MeshBasicMaterial( { color: 'white', overdraw: 0.5, map: texture } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.y = 10;
        cube.position.x = 0;
        cube.position.z = 0;
        this.voiture = cube;

    }

        public obtenirObjetVoiture3D(): THREE.Mesh{
            return this.voiture;
        }

}