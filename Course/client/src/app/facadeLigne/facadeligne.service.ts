import { Injectable, Component } from '@angular/core';
import * as THREE from 'three';

import { FacadePointService } from '../facadePoint/facadepoint.service';

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

      public modificationdecouleur(position, pointsLine: any, points: any[]): void {
        const couleurListe = pointsLine.geometry.attributes.color.array;
        if (points.length < 2) {
          couleurListe[position * 3] = 0.55;
          couleurListe[position * 3 + 1] = 0.91;
          couleurListe[position * 3 + 2] = 0.64;
        }
        pointsLine.geometry.attributes.color.needsUpdate = true;
      }

      public modifierPointLine(positionTableauPoints, positionPoint, pointsLine: any, points: any[]): void {
        const pointsLinePosition = pointsLine.geometry.attributes.position.array;
        this.modificationdecouleur(positionTableauPoints, pointsLine, points);
        pointsLinePosition[positionTableauPoints * 3] = positionPoint.x;
        pointsLinePosition[positionTableauPoints * 3 + 1] = positionPoint.y;
        pointsLinePosition[positionTableauPoints * 3 + 2] = positionPoint.z;
        pointsLine.geometry.attributes.position.needsUpdate = true;
      }

      public ajouterPointLine(positionNouveauPoint, compteur: number, pointsLine: any, points: any[]): void {
        this.modifierPointLine(compteur, positionNouveauPoint, pointsLine, points);
        pointsLine.geometry.setDrawRange(0, compteur + 1);
      }
}
