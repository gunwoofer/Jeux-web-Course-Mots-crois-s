import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import * as THREE from 'three';

export class FlaqueDEau extends ElementDePiste {

    constructor(listePosition: THREE.Vector3[], position?: THREE.Vector3) {
        super();
        this.typeElementDePiste = TypeElementPiste.FlaqueDEau;
        if (position) {
            this.position = position;
        } else {
            this.position = this.genererPositionAleatoire(listePosition, true);
        }
    }

    public genererMesh(): void {
        const flaqueDEauGeometrie = new THREE.CircleGeometry(2, 7);
        const materiel = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const mesh = new THREE.Mesh(flaqueDEauGeometrie, materiel);
        this.mesh = mesh;
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
        DeplacementService.aquaPlannageFlaqueDEau(voiture, vecteurVoiture);
    }
}
