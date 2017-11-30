import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import * as THREE from 'three';
import { HEX_NOIR } from '../constant';

export class NidDePoule extends ElementDePiste {

    constructor(listePosition: THREE.Vector3[], position?: THREE.Vector3) {
        super();

        this.typeElementDePiste = TypeElementPiste.NidDePoule;
        this.position = (position) ? position : this.genererPositionAleatoire(listePosition, true);
    }

    public genererMesh(): void {
        const nidDePouleGeometrie = this.ajouterBruitGeometrie( new THREE.CircleGeometry(1, 10) );
        const materiel = new THREE.MeshPhongMaterial({ color: HEX_NOIR });

        this.mesh = new THREE.Mesh(nidDePouleGeometrie, materiel);
    }

    private ajouterBruitGeometrie(geometrie: THREE.CircleGeometry): THREE.CircleGeometry {
        for (let i = 1; i < 10; i++) {
            geometrie.vertices[i].x = Math.random() * 1.5;
        }
        return geometrie;
    }

    public effetSurObstacle(voiture: Voiture): void {
        DeplacementService.reduireVitesseNidDePoule(voiture);
        DeplacementService.secousseNidDePoule(voiture);
    }
}
