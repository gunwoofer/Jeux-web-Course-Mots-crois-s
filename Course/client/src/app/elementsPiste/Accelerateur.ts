import { Voiture } from './../voiture/Voiture';
import { ElementDePiste } from './ElementDePiste';
import * as THREE from 'three';

export class Accelerateur extends ElementDePiste {

    constructor(x: number, y: number, z: number) {
        super(x, y, z);
        this.mesh = this.genererMesh();
        this.mesh.position.set(this.x, this.y, this.z);

    }

    public genererMesh(): THREE.Mesh {
        const accelerateurGeometrie = new THREE.PlaneGeometry(2, 2);
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
    public genererRayCaster(vecteur: THREE.Vector3): void {
        const positionAccelerateur = new THREE.Vector3(this.x, this.y, this.z);
        this.raycaster = new THREE.Raycaster(positionAccelerateur, vecteur);
    }

    public effetSurObstacle(voiture: Voiture): void {
        console.log('Sur accelerateur !');
    }

}
