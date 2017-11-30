import { PointsFacade } from './../pointsFacade';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { POINTS_MAXIMUM, COMPOSANTE_R_POINT_EDITEUR, COMPOSANTE_G_POINT_EDITEUR, COMPOSANTE_B_POINT_EDITEUR } from './../constant';

const FACTEUR_MULTIPLICATION = 3;
const DEBUT_DESSIN = 0;
const NOMBRE_SOMMET_DEBUT_BUFFER = 6;

@Injectable()

export class FacadeLigneService {

    public creerLignePoints(): THREE.Line {
        const geometrie = new THREE.BufferGeometry();
        const materiel = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
        this.modificationGeometrie(geometrie);
        return new THREE.Line(geometrie, materiel);
    }

    private modificationGeometrie(geometrie: THREE.BufferGeometry): void {
        geometrie.addAttribute('position',
            new THREE.BufferAttribute(new Float32Array(POINTS_MAXIMUM * FACTEUR_MULTIPLICATION), FACTEUR_MULTIPLICATION));
        geometrie.addAttribute('color',
            new THREE.BufferAttribute(new Float32Array(POINTS_MAXIMUM * FACTEUR_MULTIPLICATION), FACTEUR_MULTIPLICATION));
        geometrie.setDrawRange(DEBUT_DESSIN, DEBUT_DESSIN);

    }

    public modifierLignePoints(positionTableauPoints: number,
                               positionPoint: THREE.Vector3,
                               lignePoints: any,
                               points: PointsFacade[]): void {
        const lignePointsPosition = lignePoints.geometry.attributes.position.array;
        this.modificationDeCouleur(positionTableauPoints, lignePoints, points);
        lignePointsPosition[positionTableauPoints * FACTEUR_MULTIPLICATION] = positionPoint.x;
        lignePointsPosition[positionTableauPoints * FACTEUR_MULTIPLICATION + 1] = positionPoint.y;
        lignePointsPosition[positionTableauPoints * FACTEUR_MULTIPLICATION + 2] = positionPoint.z;
        lignePoints.geometry.attributes.position.needsUpdate = true;
    }

    public ajouterLignePoints(positionNouveauPoint: THREE.Vector3, compteur: number, lignePoints: any, points: PointsFacade[]): void {
        this.modifierLignePoints(compteur, positionNouveauPoint, lignePoints, points);
        lignePoints.geometry.setDrawRange(DEBUT_DESSIN, compteur + 1);
    }

    public retirerAncienlignePoints(compteur: number, lignePoints: any, points: PointsFacade[]): void {
        this.modifierLignePoints(compteur - 1, new THREE.Vector3(), lignePoints, points);
        lignePoints.geometry.setDrawRange(DEBUT_DESSIN, compteur - 1);
    }

    public obtenirLigneDeDepart(lignePoints: any): number[] {
        const positions = lignePoints.geometry.attributes.position.array.length > 0 ? this.positionLigneDeDepart(lignePoints) : null;
        return positions;
    }

    public positionLigneDeDepart(lignePoints: any): number[] {
        const positions = new Array();
        for (let sommet = 0; sommet < NOMBRE_SOMMET_DEBUT_BUFFER; sommet++) {
            positions[sommet] = lignePoints.geometry.attributes.position.array[sommet];
        }
        return positions;
    }

    private modificationDeCouleur(position: number, lignePoints: any, points: PointsFacade[]): void {
        const couleurListe = lignePoints.geometry.attributes.color.array;
        if (points.length < 2) {
            couleurListe[position * FACTEUR_MULTIPLICATION] = COMPOSANTE_R_POINT_EDITEUR;
            couleurListe[position * FACTEUR_MULTIPLICATION + 1] = COMPOSANTE_G_POINT_EDITEUR;
            couleurListe[position * FACTEUR_MULTIPLICATION + 2] = COMPOSANTE_B_POINT_EDITEUR;
        }
        lignePoints.geometry.attributes.color.needsUpdate = true;
    }
}
