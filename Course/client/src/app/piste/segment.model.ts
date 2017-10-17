import * as THREE from 'three';

export const COULEUR_PISTE = 'blue';
export const LARGEUR_PISTE = 50;

export class Segment {
    private pointDebut: THREE.Vector3;
    private pointFin: THREE.Vector3;
    private materiel: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( { color : COULEUR_PISTE } );
    private geometrie: THREE.PlaneGeometry;
    private visuelDuSegment: THREE.Mesh;
    private longueur: number;
    private largeur: number;
    private angle: number;

    constructor(pointDebut: THREE.Vector3, pointFin: THREE.Vector3) {
        this.pointDebut = pointDebut;
        this.pointFin = pointFin;
        this.longueur = this.obtenirLongueur(pointDebut, pointFin);
        this.geometrie = new THREE.PlaneGeometry(LARGEUR_PISTE, this.longueur);
        this.visuelDuSegment = new THREE.Mesh(this.geometrie, this.materiel);
        this.angle = this.obtenirAngle();
        this.visuelDuSegment.rotateZ(this.angle);
        this.visuelDuSegment.position.x = (pointDebut.x + pointFin.x) / 2;
        this.visuelDuSegment.position.y = (pointDebut.y + pointFin.y) / 2;

    }

    private obtenirLongueur(pointDebut: THREE.Vector3, pointFin: THREE.Vector3): number {
        const longueur: number = Math.sqrt(
            Math.pow(pointFin.x - pointDebut.x, 2) + Math.pow(pointFin.y - pointDebut.y, 2) + Math.pow(pointFin.z - pointDebut.z, 2)
        );
        return longueur;
    }

    public obtenirVisuelSegment(): THREE.Mesh {
        return this.visuelDuSegment;
    }

    public obtenirAngle(): number {
        if (this.angle === undefined) {
            this.calculerAngle();
        }
        return this.angle;
    }

    private calculerAngle(): void {
        this.angle = Math.atan((this.pointFin.x - this.pointDebut.x) / (this.pointFin.y - this.pointDebut.y));
    }
}
