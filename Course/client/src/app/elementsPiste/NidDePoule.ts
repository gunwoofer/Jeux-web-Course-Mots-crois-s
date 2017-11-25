import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import { ElementDePiste } from './ElementDePiste';
import * as THREE from 'three';


export class NidDePoule extends ElementDePiste {


    constructor(listePoint: THREE.Vector3[]) {
        super();
        this.position = this.genererPositionAleatoire(listePoint);
        this.mesh = this.genererMesh();
        this.mesh.position.set(this.position.x, this.position.y, this.position.z);
    }

    public genererMesh(): THREE.Mesh {
        let nidDePouleGeometrie = new THREE.CircleGeometry(1, 10);

        nidDePouleGeometrie = this.ajouterBruitGeometrie(nidDePouleGeometrie);

        const materiel = new THREE.MeshPhongMaterial({ color: 0x000000 });

        const mesh = new THREE.Mesh(nidDePouleGeometrie, materiel);
        return mesh;
    }

    private ajouterBruitGeometrie(geometrie: THREE.CircleGeometry): THREE.CircleGeometry {
        for (let i = 1; i < 10; i++) {
            geometrie.vertices[i].x = Math.random() * 1.5;
        }
        return geometrie;
    }


    public effetSurObstacle(voiture: Voiture): void {
        this.deplacementService.reduireVitesseNidDePoule(voiture);
        this.deplacementService.secousseNidDePoule(voiture);
    }

    public genererPositionAleatoire(listePoints: THREE.Vector3[]): THREE.Vector3 {
        const segmentAleatoire = this.genererSegmentAleatoire(listePoints);
        const point1 = segmentAleatoire[0];
        const point2 = segmentAleatoire[1];
        const pente = this.calculerPenteDroite(point1, point2);
        const xPositionNidDePoule = this.trouverXAleatoire(point1.x, point2.x);
        const yPositionNidDePoule = pente * xPositionNidDePoule + this.calculerOrdonneeALOrigine(point1, pente);

        return new THREE.Vector3(xPositionNidDePoule, yPositionNidDePoule, 0.01);
    }

}
