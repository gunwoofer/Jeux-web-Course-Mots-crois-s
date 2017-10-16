import * as THREE from 'three';

export const COULEUR_PISTE = 'blue';
export const LARGEUR_PISTE = 5;
export const RADIANT_CERCLE = LARGEUR_PISTE / 2;
export const NOMBRE_TRIANGLE_CERCLE = 3;
export const PI_SUR_4 = Math.PI / 4;

export class SegmentDePiste {
    private pointDebut: THREE.Vector3;
    private pointFin: THREE.Vector3;
    private materiel: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( { color : COULEUR_PISTE } );
    private geometrie: THREE.PlaneGeometry;
    private cercleDebut: THREE.CircleGeometry;
    private cercleFin: THREE.CircleGeometry;
    private visuelDuSegment: THREE.Mesh;
    private longueur: number;
    private largeur: number;
    private angle: number;

    constructor(pointDebut: THREE.Vector3, pointFin: THREE.Vector3) {
        this.pointDebut = pointDebut;
        this.pointFin = pointFin;
        this.longueur = this.obtenirLongueur(pointDebut, pointFin);
        this.geometrie = new THREE.PlaneGeometry(LARGEUR_PISTE, this.longueur);
        this.cercleDebut = new THREE.CircleGeometry(RADIANT_CERCLE, NOMBRE_TRIANGLE_CERCLE );
        this.cercleFin = new THREE.CircleGeometry(RADIANT_CERCLE, NOMBRE_TRIANGLE_CERCLE );
        this.angle = this.obtenirAngle();
        this.visuelDuSegment = new THREE.Mesh(this.geometrie, this.materiel);
        this.visuelDuSegment.rotateZ(this.angle);
        this.visuelDuSegment.position.x = (pointFin.x - pointDebut.x)/2;
        this.visuelDuSegment.position.y = (pointFin.y - pointDebut.y)/2;

    }


    public trouverPositionXouY(pointDebut: number, pointFin: number): number {
        let difference: number;
        let milieu: number;

        if (pointFin < 0 && pointDebut < 0) {
            difference = Math.abs(pointFin - pointDebut);
            milieu = difference / 2;
            if (pointFin > pointDebut) {
                return pointDebut + milieu;
            } else {
                return pointFin + milieu;
            }
        }

        if (pointFin > 0 && pointDebut > 0) {
            difference = Math.abs(pointFin - pointDebut);
            milieu = difference / 2;
            if (pointFin > pointDebut) {
                return pointDebut + milieu;
            } else {
                return pointFin + milieu;
            }
        }

        if (pointFin < 0 && pointDebut > 0 ) {
            difference = ( Math.abs(pointFin) + Math.abs(pointDebut) );
            milieu = difference / 2;
            return pointDebut - milieu;
        }

        if (pointDebut < 0 && pointFin > 0) {
            difference = ( Math.abs(pointFin) + Math.abs(pointDebut) );
            milieu = difference / 2;
            return pointDebut + milieu;
        }

    }

    private obtenirLongueur(pointDebut: THREE.Vector3, pointFin: THREE.Vector3): number {
        const longueur: number = Math.sqrt(
            Math.pow(pointFin.x - pointDebut.x, 2) + Math.pow(pointFin.y - pointDebut.y, 2) + Math.pow(pointFin.z - pointDebut.z, 2)
        );
        return longueur;
    }

    public obtenirVisuelSegment(): THREE.Mesh {
        console.log("POINT DEBUT :");
        this.afficherPointConsole(this.pointDebut);
        console.log("POINT FIN :");
        this.afficherPointConsole(this.pointFin);
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

        if (Math.abs(this.angle) < PI_SUR_4) {
            this.angle = Math.atan((this.pointFin.y - this.pointDebut.y) / (this.pointFin.x - this.pointDebut.x));
        }
    }

    

    private afficherPointConsole(point: THREE.Vector3): void {
        console.log('Coordonnees du point : x = ' + point.x + ' y = ' + point.y + ' z = ' + point.z );
    }
}