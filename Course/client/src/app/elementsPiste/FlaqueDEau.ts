import { Voiture } from './../voiture/Voiture';
import { ElementDePiste } from './ElementDePiste';
import * as THREE from 'three';

export class FlaqueDEau extends ElementDePiste {

    constructor(x: number, y: number, z: number) {
        super(x, y, z);

    }

    public genererRayCaster(vecteur: THREE.Vector3): void {
        const positionNidDePoule = new THREE.Vector3(this.x, this.y, this.z);
        this.raycaster = new THREE.Raycaster(positionNidDePoule, vecteur);
    }


    public effetSurObstacle(voiture: Voiture): void {
        throw new Error('Method not implemented.');
    }
    public stopperIntervalle(): void {
        return;
    }
}
