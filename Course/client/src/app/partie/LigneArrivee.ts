import { FonctionMaths } from './../fonctionMathematiques';
import { DISTANCE_RAISONNABLE_PRES_LIGNE_ARRIVEE, Z_AU_DESSUS_DU_SEGMENT } from './../constant';
import * as THREE from 'three';
import { Voiture } from '../voiture/Voiture';

export class LigneArrivee {
    private vecteurDebut: THREE.Vector3;
    private vecteurFin: THREE.Vector3;
    private segmentArrivee: THREE.Mesh;

    constructor(vecteurDebut: THREE.Vector3, vecteurFin: THREE.Vector3, segmentArrivee: THREE.Mesh) {
        this.vecteurDebut = vecteurDebut;
        this.vecteurFin = vecteurFin;
        this.segmentArrivee = segmentArrivee;
    }

    public aFranchitLigne(voiture: Voiture): boolean {
        if (this.estSurLaLigneArrivee(this.vecteurDebut, this.vecteurFin, voiture.obtenirPointMilieu(), voiture)) {
            return true;
        }
        return false;
    }

    // Si le produit vectoriel est = 0, alors il est aligné avec la ligne.
    private estSurLaLigneArrivee(premierVecteur: THREE.Vector3,
        deuxiemeVecteur: THREE.Vector3, troisiemeVecteur: THREE.Vector3, voiture: Voiture): boolean {
        if (FonctionMaths.calculerDistanceSegmentPoint(premierVecteur, deuxiemeVecteur, troisiemeVecteur)
        < DISTANCE_RAISONNABLE_PRES_LIGNE_ARRIVEE && this.estSurLeSegmentDeDepart(voiture)) {
            return true;
        }

        return false;
    }

    private estSurLeSegmentDeDepart(voiture: Voiture): boolean {
        const versLeBas = new THREE.Vector3(0, 0, -1);
        voiture.voiture3D.position.z = Z_AU_DESSUS_DU_SEGMENT;
        const raycaster = this.genererRayCaster(voiture.voiture3D.position, versLeBas);

        if (raycaster.intersectObject(this.segmentArrivee).length !== 0) {
            return true;
        }

        return false;
    }

    private genererRayCaster(position: THREE.Vector3, vecteur: THREE.Vector3): THREE.Raycaster {
        return new THREE.Raycaster(position, vecteur);
    }
}
