import { Voiture } from './../voiture/Voiture';
import { ElementDePiste } from './ElementDePiste';
import * as THREE from 'three';

export class NidDePoule extends ElementDePiste {
    constructor(x: number, y: number, z: number) {
        super(x, y, z);
        this.mesh = this.genererMesh(); // Remplacer le rayon par la taille de la voiture
        this.mesh.position.set(this.x, this.y, this.z);
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

    public genererRayCaster(vecteur: THREE.Vector3): void {
        const positionNidDePoule = new THREE.Vector3(this.x, this.y, this.z);
        this.raycaster = new THREE.Raycaster(positionNidDePoule, vecteur);
    }

    public effetSurObstacle(voiture: Voiture): void {
        voiture.reduireVitesseNidDePoule();
        voiture.secousseNidDePoule();
    }
}
