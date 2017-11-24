import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import { ElementDePiste } from './ElementDePiste';
import * as THREE from 'three';

export class FlaqueDEau extends ElementDePiste {

    constructor(x: number, y: number, z: number, private deplacementService: DeplacementService) {
        super(x, y, z);
        this.mesh = this.genererMesh();
        this.mesh.position.set(this.x, this.y, this.z);
    }

    public genererMesh(): THREE.Mesh {
        const flaqueDEauGeometrie = new THREE.CircleGeometry(2, 10);
        const materiel = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const mesh = new THREE.Mesh(flaqueDEauGeometrie, materiel);
        return mesh;
    }



    public genererRayCaster(vecteur: THREE.Vector3): void {
        const positionFlaqueDEau = new THREE.Vector3(this.x, this.y, this.z);
        this.raycaster = new THREE.Raycaster(positionFlaqueDEau, vecteur);
    }


    public effetSurObstacle(voiture: Voiture): void {
        console.log('Sur flaque d eau !');
    }
}
