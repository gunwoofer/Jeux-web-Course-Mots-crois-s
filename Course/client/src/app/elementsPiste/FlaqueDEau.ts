import { DeplacementService } from './../generateurPiste/deplacement.service';
import { Voiture } from './../voiture/Voiture';
import { ElementDePiste, TypeElementPiste } from './ElementDePiste';
import * as THREE from 'three';
import { HEX_BLEU, RADIAN_FLAQUE_EAU, SEGMENTS_FLAQUE_EAU,
    VOITURE_VECTEUR_ARRIERE_GAUCHE, VOITURE_VECTEUR_AVANT_GAUCHE } from '../constant';

export class FlaqueDEau extends ElementDePiste {

    constructor(listePosition: THREE.Vector3[], position?: THREE.Vector3) {
        super();

        this.typeElementDePiste = TypeElementPiste.FlaqueDEau;
        this.position = (position) ? position : this.genererPositionAleatoire(listePosition, true);
    }

    public genererMesh(): void {
        const flaqueDEauGeometrie = new THREE.CircleGeometry(RADIAN_FLAQUE_EAU, SEGMENTS_FLAQUE_EAU);
        const materiel = new THREE.MeshPhongMaterial({ color: HEX_BLEU });
        const mesh = new THREE.Mesh(flaqueDEauGeometrie, materiel);

        this.mesh = mesh;
    }

    public effetSurObstacle(voiture: Voiture): void {
        const vecteurAvantGauche = new THREE.Vector3();
        const vecteurArriereGauche = new THREE.Vector3();

        vecteurAvantGauche.setFromMatrixPosition(voiture.voiture3D.children[VOITURE_VECTEUR_AVANT_GAUCHE].matrixWorld);
        vecteurArriereGauche.setFromMatrixPosition(voiture.voiture3D.children[VOITURE_VECTEUR_ARRIERE_GAUCHE].matrixWorld);

        const vecteurVoiture = new THREE.Vector3 (
            this.obtenirMilieuVoitureX(vecteurAvantGauche, vecteurArriereGauche),
            this.obtenirMilieuVoitureY(vecteurAvantGauche, vecteurArriereGauche),
            0
        );

        DeplacementService.aquaPlannageFlaqueDEau(voiture, vecteurVoiture);
    }

    private obtenirMilieuVoitureX(vecteurAvantGauche: THREE.Vector3, vecteurArriereGauche: THREE.Vector3): number {
        return vecteurAvantGauche.x - vecteurArriereGauche.x;
    }

    private obtenirMilieuVoitureY(vecteurAvantGauche: THREE.Vector3, vecteurArriereGauche: THREE.Vector3): number {
        return vecteurAvantGauche.y - vecteurArriereGauche.y;
    }
}
