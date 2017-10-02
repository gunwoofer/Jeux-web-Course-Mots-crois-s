import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class FacadePointService {
    /*public creerPoint(coordonnees: THREE.Vector3, couleur: string, compteur: number): THREE.Points {
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
        point.name = '' + compteur;
        return point;
      }

      public dessinerDernierPoint(point: THREE.Points, points: THREE.Points[], dessinTermine: boolean): void {
        const distance = point.position.distanceTo(points[0].position);
        if (distance >= 0 && distance < 3) {
          if (points.length > 2) {
            point.position.copy(points[0].position);
            dessinTermine = true;
          } else {
            throw new Error('une piste a trois points minimum');
          }
        }
      }

      public ajouterPoint(point: THREE.Points, scene: THREE.Scene, dessinTermine: boolean, points: THREE.Points[], 
        compteur: number, pointsLine: any): void {
        if (!dessinTermine) {
          scene.add(point);
        }
        this.ajouterPointLine(point.position, pointsLine, points, compteur);
        points.push(point);
        compteur++;
      }

      public modificationdecouleur(position: number, pointsLine: any, points: THREE.Points[]): void {
        const couleurListe = pointsLine.geometry.attributes.color.array;
        if (points.length < 2) {
          couleurListe[position * 3] = 0.55;
          couleurListe[position * 3 + 1] = 0.91;
          couleurListe[position * 3 + 2] = 0.64;
        }
        pointsLine.geometry.attributes.color.needsUpdate = true;
      }

      public modifierPointLine(positionTableauPoints, positionPoint, pointsLine: any, points: THREE.Points[]): void {
        const pointsLinePosition = pointsLine.geometry.attributes.position.array;
        this.modificationdecouleur(positionTableauPoints, pointsLine, points);
        pointsLinePosition[positionTableauPoints * 3] = positionPoint.x;
        pointsLinePosition[positionTableauPoints * 3 + 1] = positionPoint.y;
        pointsLinePosition[positionTableauPoints * 3 + 2] = positionPoint.z;

        pointsLine.geometry.attributes.position.needsUpdate = true;

      }

      public ajouterPointLine(positionNouveauPoint, pointsLine: any, points: THREE.Points[], compteur: number): void {
        this.modifierPointLine(compteur, positionNouveauPoint, pointsLine, points);
        pointsLine.geometry.setDrawRange(0, compteur + 1);
      }

      public dessinerPoint(event, dessinTermine: boolean, ): number {
        let objet, point;
        if (!this.dessinTermine) {
          objet = this.obtenirIntersection(event);
          // point = this.creerPoint(objet.point, 'black');
          point = this.facadePointService.creerPoint(objet.point, 'black', this.compteur);
          if (this.points.length === 0) {
            point.material.status = 'premier';
          } else {
            try {
              this.facadePointService.dessinerDernierPoint(point, this.points, this.dessinTermine);
            } catch (e) {
              alert(e.message);
              return;
            }
          }
          this.facadePointService.ajouterPoint(point, this.scene, this.dessinTermine, this.points, this.compteur, this.pointsLine);
          this.actualiserDonnees();
          this.redessinerCourbe();
          this.render();
        } else {
          return 0;
        }
      }*/
}
