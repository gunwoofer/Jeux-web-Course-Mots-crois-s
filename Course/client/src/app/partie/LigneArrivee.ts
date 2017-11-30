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
        const pointMilieu: THREE.Vector3 = voiture.obtenirPointMilieu();

        if (this.estSurLaLigneArrivee(this.vecteurDebut, this.vecteurFin, pointMilieu, voiture)) {
            return true;
        }
        return false;
    }

    // Si le produit vectoriel est = 0, alors il est aligné avec la ligne.
    public estSurLaLigneArrivee(premierVecteur: THREE.Vector3,
        deuxiemeVecteur: THREE.Vector3, troisiemeVecteur: THREE.Vector3, voiture: Voiture): boolean {
        if (this.calculDistanceSegmentAPoint(premierVecteur, deuxiemeVecteur, troisiemeVecteur) < DISTANCE_RAISONNABLE_PRES_LIGNE_ARRIVEE) {
            if (this.estSurLeSegmentDeDepart(voiture)) {
                return true;
            }
        }
        return false;
    }

    public estSurLeSegmentDeDepart(voiture: Voiture): boolean {
        const versLeBas: THREE.Vector3 = new THREE.Vector3(0, 0, -1);
        voiture.voiture3D.position.z = Z_AU_DESSUS_DU_SEGMENT;
        const raycaster: THREE.Raycaster = new THREE.Raycaster(voiture.voiture3D.position, versLeBas);
        if (raycaster.intersectObject(this.segmentArrivee).length !== 0) {
            return true;
        }
        return false;
    }

    public calculDistanceSegmentAPoint(premierVecteur: THREE.Vector3,
        deuxiemeVecteur: THREE.Vector3, troisiemeVecteur: THREE.Vector3): number {

        // Trouver AB
        const abx: number = premierVecteur.x - deuxiemeVecteur.x;
        const aby: number = premierVecteur.y - deuxiemeVecteur.y;

        // Trouver AV
        const avx: number = troisiemeVecteur.x - premierVecteur.x;
        const avy: number = troisiemeVecteur.y - premierVecteur.y;

        // Produit vectoriel AV ^ AB
        const avabx: number = avx * aby - avy * abx;
        const avaby: number = avy * abx - avx * aby;

        // NORME AV ^ AB
        const avabnorme: number = Math.pow(Math.pow(avabx, 2) + Math.pow(avaby, 2), 0.5);

        return avabnorme;
    }

    public correspondPositionX(position: number): boolean {
        return (position > this.vecteurDebut.x && position < this.vecteurFin.x) ? true : false;
    }

    public correspondPositionY(position: number): boolean {
        return (position > this.vecteurDebut.y && position < this.vecteurFin.y) ? true : false;
    }
}
