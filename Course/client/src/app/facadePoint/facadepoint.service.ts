import { Injectable, Component } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class FacadePointService {
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
    point.geometry.computeBoundingSphere();
    point.geometry.boundingSphere.radius = 100;
    point.name = '' + this.compteur;
    return point;
  }
}
