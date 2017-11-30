import { Injectable } from '@angular/core';
import * as THREE from 'three';

export const SIZE_POINT = 5;
export const CERCLE_RADIUS = 100;

@Injectable()

export class FacadePointService {

  private listeErreurCouleur = {
    normal: 'green',
    angle45: 'red',
    proche: 'orange',
    premier: 'purple'
  };

  public compteur: number;
  constructor () { this.compteur = 0; }

  public creerPoint(coordonnees: THREE.Vector3, couleur: string): THREE.Points {
      const geometrie = new THREE.Geometry();
      geometrie.vertices.push(
        new THREE.Vector3()
      );
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

  public actualiserCouleurPoints(points: any[]): void {
      for (const point of points) {
        point.material.color.set(this.listeErreurCouleur[point.material.status]);
        point.material.size = SIZE_POINT;
      }
  }

  public restaurerStatusPoints(points: any[]): void {
      for (let point = 1; point < points.length; point++) {
        points[point].material.status = 'normal';
      }
  }

  public viderListeDesPoints(points: any[]): void {
      for (let point = points.length - 1; point >= 0; point--) {
        points.pop();
      }
  }
}
