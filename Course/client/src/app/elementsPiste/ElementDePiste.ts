import { Voiture } from './../voiture/Voiture';
import * as THREE from 'three';

export enum TypeElementPiste {
    Accelerateur,
    FlaqueDEau,
    NidDePoule
}

export abstract class ElementDePiste {
    public position: THREE.Vector3;
    protected mesh: THREE.Mesh;
    public raycaster: THREE.Raycaster;
    public antirebond;
    public typeElementDePiste: TypeElementPiste;

    constructor() {
        this.antirebond = false;
    }


    public abstract effetSurObstacle(voiture: Voiture): void;

    public genererRayCaster(vecteur: THREE.Vector3): void {
        const positionFlaqueDEau = new THREE.Vector3(this.position.x, this.position.y, this.position.z);
        this.raycaster = new THREE.Raycaster(positionFlaqueDEau, vecteur);
    }

    public obtenirMesh(): THREE.Mesh {
        return this.mesh;
    }

    public genererPositionAleatoire(listePosition: THREE.Vector3[], estUnAccelerateur: boolean): THREE.Vector3 {
        const segmentAleatoire = this.genererSegmentAleatoire(listePosition);
        const pointDebut = segmentAleatoire[0];
        const pointFin = segmentAleatoire[1];

        let x: number;

        if (estUnAccelerateur) {
            x = this.trouverXAleatoire(pointDebut.x, this.obtenirMoitieEntre2points(pointDebut.x, pointFin.x));
        } else {
            x = this.trouverXAleatoire(pointDebut.x, pointFin.x);
        }
        const pente = this.calculerPenteDroite(pointDebut, pointFin);
        const y = pente * x + this.calculerOrdonneeALOrigine(pointDebut, pente);
        return new THREE.Vector3(x, y, 0.01);
    }

    private obtenirMoitieEntre2points(xDebut: number, xFin: number) {
        return (xDebut + (xFin - xDebut ) / 2);
    }
    private trouverXAleatoire(xDebut: number, xFin: number): number {
        return Math.random() * (Math.max(xDebut, xFin) - Math.min(xDebut, xFin)) + Math.min(xDebut, xFin);
    }

    private calculerPenteDroite(pointDebut: THREE.Vector3, pointFin: THREE.Vector3): number {
        return ((pointFin.y - pointDebut.y) / (pointFin.x - pointDebut.x));
    }

    private calculerOrdonneeALOrigine(pointDebut: THREE.Vector3, pente: number): number {
        return (pointDebut.y - pente * pointDebut.x);
    }

    private genererSegmentAleatoire(listePoints: THREE.Vector3[]): THREE.Vector3[] {
        const pointAleatoire = Math.round(Math.random() * (listePoints.length - 2));
        return [listePoints[pointAleatoire], listePoints[pointAleatoire + 1]];
    }

}
