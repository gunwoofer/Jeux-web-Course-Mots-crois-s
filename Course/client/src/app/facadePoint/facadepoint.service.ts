import { Injectable } from '@angular/core';
import * as THREE from 'three';

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
      new THREE.Vector3(0, 0, 0)
    );
    const materiel = new THREE.PointsMaterial({
      size: 5,
      color: couleur,
      opacity: 1
    });
    const point = new THREE.Points(geometrie, materiel);
    point.position.copy(coordonnees);
    point.position.z = 0;
    point.geometry.computeBoundingSphere();
    point.geometry.boundingSphere.radius = 100;
    point.name = '' + this.compteur;
    return point;
  }

  public actualiserCouleurPoints(points: any[]): void {
    for (const point of points) {
      point.material.color.set(this.listeErreurCouleur[point.material.status]);
      point.material.size = 5;
    }
  }

  public restaurerStatusPoints(points: any[]): void {
    for (let i = 1; i < points.length; i++) {
      points[i].material.status = 'normal';
    }
  }

  public viderListeDesPoints(points: any[]): void {
    for (let i = points.length - 1; i >= 0; i--) {
      points.pop();
    }
  }
}
