import * as THREE from 'three';

export class FonctionMaths {
    public static obtenirMoitieEntre2points(xDebut: number, xFin: number) {
        return (xDebut + (xFin - xDebut) / 2);
    }

    public static trouverXAleatoire(xDebut: number, xFin: number): number {
        // return Math.random() * (Math.max(xDebut, xFin) - Math.min(xDebut, xFin)) + Math.min(xDebut, xFin);
        return Math.random() * (xFin - xDebut) + xDebut;
    }

    public static calculerPenteDroite(pointDebut: THREE.Vector3, pointFin: THREE.Vector3): number {
        return ((pointFin.y - pointDebut.y) / (pointFin.x - pointDebut.x));
    }

    public static calculerOrdonneeALOrigine(pointDebut: THREE.Vector3, pente: number): number {
        return (pointDebut.y - pente * pointDebut.x);
    }

    public static calculerDistanceSegmentPoint(vecteurDebutSegment: THREE.Vector3, vecteurFinSegment: THREE.Vector3,
        vecteurPoint: THREE.Vector3): number {
        // Trouver AB
        const abx: number = vecteurDebutSegment.x - vecteurFinSegment.x;
        const aby: number = vecteurDebutSegment.y - vecteurFinSegment.y;

        // Trouver AV
        const avx: number = vecteurPoint.x - vecteurDebutSegment.x;
        const avy: number = vecteurPoint.y - vecteurDebutSegment.y;

        // Produit vectoriel AV ^ AB
        const avabx: number = avx * aby - avy * abx;
        const avaby: number = avy * abx - avx * aby;

        // NORME AV ^ AB
        return Math.pow(Math.pow(avabx, 2) + Math.pow(avaby, 2), 0.5);
    }

    public static calculerMilieuRectangle(rectangle: THREE.Mesh): THREE.Vector3 {
        rectangle.geometry.computeBoundingBox();
        return new THREE.Vector3(
            (rectangle.geometry.boundingBox.max.x + rectangle.geometry.boundingBox.min.x) / 2,
            (rectangle.geometry.boundingBox.max.y + rectangle.geometry.boundingBox.min.y) / 2,
            (rectangle.geometry.boundingBox.max.z + rectangle.geometry.boundingBox.min.z) / 2
        );
    }

    public static DeuxPositionTropProche(position1: THREE.Vector3, position2: THREE.Vector3, distanceMin: number): boolean {
        if ((Math.abs(position1.x - position2.x) < distanceMin)
            && (Math.abs(position1.y - position2.y) < distanceMin)) {
            return true;
        }
        return false;
    }

    public static genererPositionAleatoire(vecteur: THREE.Vector3, chiffre: number): void {
        vecteur.x = this.nombreAleatoire(-chiffre / 10, chiffre / 10);
        vecteur.z = this.nombreAleatoire(-chiffre / 10, chiffre / 10);
        vecteur.y = 0;
    }

    public static nombreAleatoire(min, max): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public static distanceEntreDeuxPoints(x1: number, y1: number, x2: number, y2: number): number {
        return Math.pow(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2), 0.5);
    }

    public static caseAleatoireTableauPosition(): number {
        return Math.round(Math.random() * 3);
    }

    public static emplacementAleatoireSkyBox(range: number): number {
        return Math.floor(Math.random() * range + 1) - 1;
    }

    public static simulationTemps(indice: number): number {
        return Math.random() * (30 - indice) + 30;
    }
}
