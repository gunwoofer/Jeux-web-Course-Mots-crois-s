import { Voiture } from './../voiture/Voiture';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import * as THREE from 'three';

export class Accelerateur extends ElementDePiste {

    constructor(listePosition: THREE.Vector3[], position?: THREE.Vector3) {
        super();
        this.typeElementDePiste = TypeElementPiste.Accelerateur;
        if (position) {
            this.position = position;
        } else {
            this.position = this.genererPositionAleatoire(listePosition, true);
        }
    }


    public genererMesh(): void {
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
        this.mesh = mesh;
    }

    public effetSurObstacle(voiture: Voiture): void {
        this.deplacementService.augmenterVitesseAccelerateur(voiture);
    }

}
