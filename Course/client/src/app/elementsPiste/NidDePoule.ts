import { Voiture } from './../voiture/Voiture';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import * as THREE from 'three';


export class NidDePoule extends ElementDePiste {


    constructor(listePosition: THREE.Vector3[], position?: THREE.Vector3) {
        super();
        this.typeElementDePiste = TypeElementPiste.NidDePoule;
        if (position) {
            this.position = position;
        } else {
            this.position = this.genererPositionAleatoire(listePosition, true);
        }
    }


    public genererMesh(): void {
        let nidDePouleGeometrie = new THREE.CircleGeometry(1, 10);

        nidDePouleGeometrie = this.ajouterBruitGeometrie(nidDePouleGeometrie);

        const materiel = new THREE.MeshPhongMaterial({ color: 0x000000 });

        const mesh = new THREE.Mesh(nidDePouleGeometrie, materiel);
        this.mesh = mesh;
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
}
