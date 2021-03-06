import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';

export enum TypeElementPiste {
    Accelerateur,
    FlaqueDEau,
    NidDePoule
}

export abstract class ElementDePiste {
    public position: THREE.Vector3;
    public raycaster: THREE.Raycaster;
    public antirebond = false;
    public typeElementDePiste: TypeElementPiste;

    public mesh: THREE.Mesh;

    public abstract effetSurObstacle(voiture: Voiture): void;
    public abstract genererMesh(): void;

    public genererRayCaster(vecteur: THREE.Vector3): void {
        const position = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
        this.raycaster = new THREE.Raycaster(position, vecteur);
    }
}
