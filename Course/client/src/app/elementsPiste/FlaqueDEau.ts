import { DeplacementVoiture } from './../generateurPiste/deplacementVoiture';
import { NOM_OBSTACLE, EffetSonore } from './../effetSonore/effetSonore';
import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import * as THREE from 'three';
import {
    HEX_BLEU, RADIAN_FLAQUE_EAU, SEGMENTS_FLAQUE_EAU,
} from '../constant';
import { Piste } from '../piste/piste.model';

export class FlaqueDEau extends ElementDePiste {

    constructor(listePosition: THREE.Vector3[], position?: THREE.Vector3) {
        super();

        this.typeElementDePiste = TypeElementPiste.FlaqueDEau;
        this.position = (position) ? position : Piste.genererPositionAleatoire(listePosition, true);
    }

    public genererMesh(): void {
        const flaqueDEauGeometrie = new THREE.CircleGeometry(RADIAN_FLAQUE_EAU, SEGMENTS_FLAQUE_EAU);
        const materiel = new THREE.MeshPhongMaterial({ color: HEX_BLEU });
        const mesh = new THREE.Mesh(flaqueDEauGeometrie, materiel);

        this.mesh = mesh;
    }

    public effetSurObstacle(voiture: Voiture): void {
        DeplacementVoiture.aquaPlannageFlaqueDEau(voiture, Voiture.vecteurVoiture(voiture));
        EffetSonore.jouerUnEffetSonore(NOM_OBSTACLE);
    }
}
