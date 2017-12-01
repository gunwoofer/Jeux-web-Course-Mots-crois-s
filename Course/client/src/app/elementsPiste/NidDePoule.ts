import { EffetSonoreService } from './../effetSonore/effetSonore.service';
import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import * as THREE from 'three';
import { HEX_NOIR } from '../constant';
import { Piste } from '../piste/piste.model';
import { DeplacementVoiture } from '../generateurPiste/deplacementVoiture';

export const RAYON = 1;
export const NOMBRE_DIVISION_CERCLE = 10;

export class NidDePoule extends ElementDePiste {

    constructor(listePosition: THREE.Vector3[], position?: THREE.Vector3) {
        super();

        this.typeElementDePiste = TypeElementPiste.NidDePoule;
        this.position = (position) ? position : Piste.genererPositionAleatoire(listePosition, true);
    }

    public genererMesh(): void {
        this.mesh = new THREE.Mesh(this.nidDePouleGeometrie(),
                                    new THREE.MeshPhongMaterial({ color: HEX_NOIR }));
    }

    private nidDePouleGeometrie(): THREE.CircleGeometry {
        return this.genererFissure(new THREE.CircleGeometry(RAYON, NOMBRE_DIVISION_CERCLE));
    }

    public effetSurObstacle(voiture: Voiture): void {
        EffetSonore.jouerUnEffetSonore(NOM_OBSTACLE);
        DeplacementVoiture.reduireVitesseNidDePoule(voiture);
        DeplacementVoiture.secousseNidDePoule(voiture);
    }

    public genererFissure(geometrie: THREE.CircleGeometry): THREE.CircleGeometry {
        for (let division = 1; division < NOMBRE_DIVISION_CERCLE; division++) {
            geometrie.vertices[division].x = Math.random() * 1.5;
        }

        return geometrie;
    }
}
