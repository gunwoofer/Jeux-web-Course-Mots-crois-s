import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import { ElementDePiste } from './ElementDePiste';
import * as THREE from 'three';

export class Accelerateur extends ElementDePiste {

    constructor(listePoint: THREE.Vector3[], deplacementService: DeplacementService) {
        super(deplacementService);
        this.position = this.genererPositionAleatoire(listePoint);
        this.mesh = this.genererMesh();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);

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

    public genererPositionAleatoire(listePoints: THREE.Vector3[]): THREE.Vector3 {
        const segmentAleatoire = this.genererSegmentAleatoire(listePoints);
        const point1 = segmentAleatoire[0];
        const point2 = segmentAleatoire[1];
        const pente = this.calculerPenteDroite(point1, point2);
        const xPositionAccelerateur = this.trouverXAleatoire(point1.x, point1.x + (point2.x - point1.x ) / 2);
        const yPositionAccelerateur = pente * xPositionAccelerateur + this.calculerOrdonneeALOrigine(point1, pente);

        return new THREE.Vector3(xPositionAccelerateur, yPositionAccelerateur, 0.01);
    }

    public effetSurObstacle(voiture: Voiture): void {
        console.log('Sur accelerateur !');
        this.deplacementService.augmenterVitesseAccelerateur(voiture);
    }

}
