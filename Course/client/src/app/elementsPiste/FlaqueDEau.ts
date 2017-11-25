import { Voiture } from './../voiture/Voiture';
import { ElementDePiste } from './ElementDePiste';
import * as THREE from 'three';

export class FlaqueDEau extends ElementDePiste {

    constructor(listePoint: THREE.Vector3[]) {
        super();
        this.position = this.genererPositionAleatoire(listePoint);
        this.mesh = this.genererMesh();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    private genererMesh(): THREE.Mesh {
        const flaqueDEauGeometrie = new THREE.CircleGeometry(2, 10);
        const materiel = new THREE.MeshPhongMaterial({ color: 0x0000ff });
        const mesh = new THREE.Mesh(flaqueDEauGeometrie, materiel);
        return mesh;
    }

    public genererPositionAleatoire(listePoints: THREE.Vector3[]): THREE.Vector3 {
        const segmentAleatoire = this.genererSegmentAleatoire(listePoints);
        const point1 = segmentAleatoire[0];
        const point2 = segmentAleatoire[1];
        const pente = this.calculerPenteDroite(point1, point2);
        const xPositionFlaqueDEau = this.trouverXAleatoire(point1.x, point2.x);
        const yPositionFlaqueDEau = pente * xPositionFlaqueDEau + this.calculerOrdonneeALOrigine(point1, pente);

        return new THREE.Vector3(xPositionFlaqueDEau, yPositionFlaqueDEau, 0.01);
    }

    public effetSurObstacle(voiture: Voiture): void {
        console.log('Sur flaque d eau !');
    }
}
