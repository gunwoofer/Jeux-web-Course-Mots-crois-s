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

    protected mesh: THREE.Mesh;

    public abstract effetSurObstacle(voiture: Voiture): void;
    public abstract genererMesh(): void;

    public genererRayCaster(vecteur: THREE.Vector3): void {
        const positionFlaqueDEau = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
        this.raycaster = new THREE.Raycaster(positionFlaqueDEau, vecteur);
    }

    public obtenirMesh(): THREE.Mesh {
        return this.mesh;
    }
}
