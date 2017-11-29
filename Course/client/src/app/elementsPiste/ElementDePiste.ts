import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';

export enum TypeElementPiste {
    Accelerateur,
    FlaqueDEau,
    NidDePoule
}

export abstract class ElementDePiste {
    protected position: THREE.Vector3;
    protected mesh: THREE.Mesh;
    protected deplacementService: DeplacementService;
    public raycaster: THREE.Raycaster;
    public antirebond;

    constructor() {
        this.antirebond = false;
        this.deplacementService = new DeplacementService();
    }


    public abstract effetSurObstacle(voiture: Voiture): void;

    public genererRayCaster(vecteur: THREE.Vector3): void {
        const positionFlaqueDEau = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
        this.raycaster = new THREE.Raycaster(positionFlaqueDEau, vecteur);
    }

    public obtenirMesh(): THREE.Mesh {
        return this.mesh;
    }

}
