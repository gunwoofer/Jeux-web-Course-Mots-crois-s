import * as THREE from 'three';

export class FonctionMaths {
    public static obtenirMoitieEntre2points(xDebut: number, xFin: number) {
        return (xDebut + (xFin - xDebut ) / 2);
    }

    public static trouverXAleatoire(xDebut: number, xFin: number): number {
        return Math.random() * (Math.max(xDebut, xFin) - Math.min(xDebut, xFin)) + Math.min(xDebut, xFin);
    }

    public static calculerPenteDroite(pointDebut: THREE.Vector3, pointFin: THREE.Vector3): number {
        return ((pointFin.y - pointDebut.y) / (pointFin.x - pointDebut.x));
    }

    public static calculerOrdonneeALOrigine(pointDebut: THREE.Vector3, pente: number): number {
        return (pointDebut.y - pente * pointDebut.x);
    }
}
