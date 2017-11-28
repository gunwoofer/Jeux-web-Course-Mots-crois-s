import { Voiture } from './../voiture/Voiture';
import { ElementDePiste } from './ElementDePiste';
import * as THREE from 'three';

export class FlaqueDEau extends ElementDePiste {

    constructor(listePosition: THREE.Vector3[]) {
        super();
        this.position = this.genererPositionAleatoire(listePosition, false);
        this.mesh = this.genererMesh();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    private genererMesh(): THREE.Mesh {
        const flaqueDEauGeometrie = new THREE.CircleGeometry(2, 7);
        const materiel = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const mesh = new THREE.Mesh(flaqueDEauGeometrie, materiel);
        return mesh;
    }


    // 4: arriere gauche 82: avant gauche
    public effetSurObstacle(voiture: Voiture): void {
        const vecteurAvantGauche = new THREE.Vector3();
        const vecteurArriereGauche = new THREE.Vector3();
        vecteurAvantGauche.setFromMatrixPosition(voiture.voiture3D.children[82].matrixWorld);
        vecteurArriereGauche.setFromMatrixPosition(voiture.voiture3D.children[4].matrixWorld);
        const vecteurVoiture = new THREE.Vector3(
            vecteurAvantGauche.x - vecteurArriereGauche.x,
            vecteurAvantGauche.y - vecteurArriereGauche.y,
            0
        );
        this.deplacementService.aquaPlannageFlaqueDEau(voiture, vecteurVoiture);
    }
}
