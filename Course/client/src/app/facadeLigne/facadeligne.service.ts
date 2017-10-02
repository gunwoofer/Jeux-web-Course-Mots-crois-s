import { Injectable, Component } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class FacadeLigneService {
    private POINTS_MAXIMUM = 1000;

    public creerLignePoints() {
        const geometrie = new THREE.BufferGeometry();
        const positions = new Float32Array(this.POINTS_MAXIMUM * 3);
        const colors = new Float32Array(this.POINTS_MAXIMUM * 3);
        geometrie.addAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometrie.addAttribute('color', new THREE.BufferAttribute(colors, 3));
        const nombreTirage = 2;
        geometrie.setDrawRange(0, 0);
        const materiel = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        const pointsLine = new THREE.Line(geometrie, materiel);
        return pointsLine;
      }

      public modificationdecouleuur(position, pointsLine: any, points: any[]): void {
        const couleurListe = pointsLine.geometry.attributes.color.array;
        if (points.length < 2) {
          couleurListe[position * 3] = 0.55;
          couleurListe[position * 3 + 1] = 0.91;
          couleurListe[position * 3 + 2] = 0.64;
        }
        pointsLine.geometry.attributes.color.needsUpdate = true;
      }
}
