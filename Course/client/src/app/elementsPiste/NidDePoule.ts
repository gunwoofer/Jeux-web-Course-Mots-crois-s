import { Voiture } from './../voiture/Voiture';
import { ElementDePiste } from './ElementDePiste';
import * as THREE from 'three';

export class NidDePoule extends ElementDePiste {
    constructor(x: number, y: number, z: number) {
        super(x, y, z);
        const geometrieNidDePoule = new THREE.CircleGeometry(4);  // Remplacer le rayon par la taille de la voiture
        const materielNidDePoule = new THREE.MeshBasicMaterial({color: 0xffff00});
        this.mesh = new THREE.Mesh(geometrieNidDePoule, materielNidDePoule);
        this.mesh.position.set(this.x, this.y, this.z);
    }

    public genererRayCaster(vecteur: THREE.Vector3): void {
        const positionNidDePoule = new THREE.Vector3(this.x, this.y, this.z);
        this.raycaster = new THREE.Raycaster(positionNidDePoule, vecteur);
    }

    public effetSurObstacle(voiture: Voiture): void {
        console.log('effet nid de poule !');
        voiture.reduireVitesseNidDePoule();
    }
}
