import { Voiture } from './../voiture/Voiture';
import { ElementDePiste } from './ElementDePiste';
import * as THREE from 'three';

export class Accelerateur extends ElementDePiste {

    constructor(listePosition: THREE.Vector3[]) {
        super();
        this.position = this.genererPositionAleatoire(listePosition, true);
        this.mesh = this.genererMesh();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);

    }

    private genererMesh(): THREE.Mesh {
        const accelerateurGeometrie = new THREE.PlaneGeometry(3, 2);
        const materiel = new THREE.MeshPhongMaterial();
        const loader = new THREE.TextureLoader();
        loader.load('../../assets/textures/accelerateur.png', (txt) => {
            txt.wrapS = THREE.RepeatWrapping;
            txt.wrapT = THREE.RepeatWrapping;
            txt.anisotropy = 4;
            txt.repeat.set( 1, 1);
            materiel.map = txt;
            materiel.needsUpdate = true;
        });
        const mesh = new THREE.Mesh(accelerateurGeometrie, materiel);
        return mesh;
    }

    public effetSurObstacle(voiture: Voiture): void {
        this.deplacementService.augmenterVitesseAccelerateur(voiture);
    }

}
