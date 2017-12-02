import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { listeErreurCouleur, PointsFacade } from '../pointsFacade';

const SIZE_POINT = 5;
const CERCLE_RADIUS = 100;
const NORMAL_STATUS = 'normal';

@Injectable()
export class FacadePointService {

    public compteur = 0;

    public static actualiserCouleurPoints(points: any[]): void {
        for (const point of points) {
            point.material.color.set(listeErreurCouleur[point.status]);
            point.material.size = SIZE_POINT;
        }
    }

    public static restaurerStatusPoints(points: PointsFacade[]): void {
        for (let point = 1; point < points.length; point++) {
            points[point].status = NORMAL_STATUS;
        }
    }

    public static viderListeDesPoints(points: PointsFacade[]): void {
        for (let point = points.length - 1; point >= 0; point--) {
            points.pop();
        }
    }

    public creerPoint(coordonnees: THREE.Vector3, couleur: string): THREE.Points {
        const geometrie = new THREE.Geometry();
        geometrie.vertices.push( new THREE.Vector3() );
        const materiel = new THREE.PointsMaterial({
            size: SIZE_POINT,
            color: couleur,
            opacity: 1
        });
        const point = new THREE.Points(geometrie, materiel);

        point.position.copy(coordonnees);
        point.position.z = 0;
        point.geometry.computeBoundingSphere();
        point.geometry.boundingSphere.radius = CERCLE_RADIUS;
        point.name = '' + this.compteur;

        return point;
    }
}
