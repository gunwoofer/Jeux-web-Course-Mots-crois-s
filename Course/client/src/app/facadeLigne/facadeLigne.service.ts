import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { POINTS_MAXIMUM, COMPOSANTE_R_POINT_EDITEUR, COMPOSANTE_G_POINT_EDITEUR, COMPOSANTE_B_POINT_EDITEUR } from './../constant';

@Injectable()
export class FacadeLigneService {

    public creerLignePoints(): THREE.Line {
        const geometrie = new THREE.BufferGeometry();
        const materiel = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });

        geometrie.addAttribute('position', new THREE.BufferAttribute( new Float32Array(POINTS_MAXIMUM * 3), 3));
        geometrie.addAttribute('color', new THREE.BufferAttribute( new Float32Array(POINTS_MAXIMUM * 3), 3));
        geometrie.setDrawRange(0, 0);

        return new THREE.Line(geometrie, materiel);
    }

    public modifierPointLine(positionTableauPoints, positionPoint, pointsLine: any, points: any[]): void {
        const pointsLinePosition = pointsLine.geometry.attributes.position.array;
        this.modificationDeCouleur(positionTableauPoints, pointsLine, points);
        pointsLinePosition[positionTableauPoints * 3] = positionPoint.x;
        pointsLinePosition[positionTableauPoints * 3 + 1] = positionPoint.y;
        pointsLinePosition[positionTableauPoints * 3 + 2] = positionPoint.z;
        pointsLine.geometry.attributes.position.needsUpdate = true;
    }

    public ajouterPointLine(positionNouveauPoint, compteur: number, pointsLine: any, points: any[]): void {
        this.modifierPointLine(compteur, positionNouveauPoint, pointsLine, points);
        pointsLine.geometry.setDrawRange(0, compteur + 1);
    }

    public retirerAncienPointLine(compteur: number, pointsLine: any, points: any[]): void {
        this.modifierPointLine(compteur - 1, new THREE.Vector3(0, 0, 0), pointsLine, points);
        pointsLine.geometry.setDrawRange(0, compteur - 1);
    }

    public obtenirLigneDeDepart(pointsLine: any): number[] {
        const positions = new Array();

        if (pointsLine.geometry.attributes.position.array.length > 0) {
            for (let i = 0; i < 6; i++) {
              positions[i] = pointsLine.geometry.attributes.position.array[i];
            }
            return positions;
        } else {
            return null;
        }

    }

    private modificationDeCouleur(position, pointsLine: any, points: any[]): void {
        const couleurListe = pointsLine.geometry.attributes.color.array;
        if (points.length < 2) {
            couleurListe[position * 3] = COMPOSANTE_R_POINT_EDITEUR;
            couleurListe[position * 3 + 1] = COMPOSANTE_G_POINT_EDITEUR;
            couleurListe[position * 3 + 2] = COMPOSANTE_B_POINT_EDITEUR;
        }
        pointsLine.geometry.attributes.color.needsUpdate = true;
    }
}
