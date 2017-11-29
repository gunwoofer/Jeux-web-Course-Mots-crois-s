import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class ContraintesCircuitService {

  public calculerAngle(numeroPoint: number, points: any[], compteur: number): number {
    if (points.length > 1) {
      const point1 = points[(numeroPoint === 0) ? compteur - 1 : numeroPoint - 1];
      const premierSegment = new THREE.Vector2(points[numeroPoint + 1].position.x - points[numeroPoint].position.x,
        points[numeroPoint + 1].position.y - points[numeroPoint].position.y).normalize();
      const precedentSegment = new THREE.Vector2(-(points[numeroPoint].position.x - point1.position.x),
        -(points[numeroPoint].position.y - point1.position.y)).normalize();
      return Math.acos(premierSegment.dot(precedentSegment));
    }
    return NaN;
  }

  public estUnAngleMoins45(numeroPoint: number, points: any[], compteur: number): boolean {
    if (points.length > 1) {
      const angle = this.calculerAngle(numeroPoint, points, compteur);
      if (angle <= 0.785398163) {
        points[numeroPoint].material.status = 'angle45';
        return true;
      }
    }
    return false;
  }

  public segmentsCoises(pointA, pointB, pointC, pointD, dessinTermine: boolean): boolean {
    const vectAB = [pointB.position.x - pointA.position.x, pointB.position.y - pointA.position.y];
    const vectAC = [pointC.position.x - pointA.position.x, pointC.position.y - pointA.position.y];
    const vectAD = [pointD.position.x - pointA.position.x, pointD.position.y - pointA.position.y];
    const vectCA = vectAC.map(function (x) { return x * -1; });
    const vectCB = [pointB.position.x - pointC.position.x, pointB.position.y - pointC.position.y];
    const vectCD = [pointD.position.x - pointC.position.x, pointD.position.y - pointC.position.y];
    const determinantABAC = vectAB[0] * vectAC[1] - vectAB[1] * vectAC[0];
    const determinantABAD = vectAB[0] * vectAD[1] - vectAB[1] * vectAD[0];
    const determinantCDCB = vectCD[0] * vectCB[1] - vectCD[1] * vectCB[0];
    const determinantCDCA = vectCD[0] * vectCA[1] - vectCD[1] * vectCA[0];
    if (Math.sign(determinantABAC) === 0 || Math.sign(determinantCDCB) === 0) {
      return false;
    } else if (Math.sign(determinantABAC) !== Math.sign(determinantABAD) && Math.sign(determinantCDCB) !== Math.sign(determinantCDCA)) {
      if (dessinTermine) {
        if (vectAD[0] === 0 && vectAD[1] === 0) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  public nombreSegmentsTropCourts(points: any[]): number {
    const largeurPiste = 10;
    let segmentTropCourt = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const tailleSegment = points[i].position.distanceTo(points[i + 1].position);
      if (tailleSegment < 2 * largeurPiste) {
        segmentTropCourt++;
        points[i].material.status = 'proche';
        points[i + 1].material.status = 'proche';
      }
    }
    return segmentTropCourt;
  }

  public nombreLignesCroisees(points: any[], dessinTermine: boolean): number {
    let nbSegmentsCroises = 0;
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length - 1; j++) {
        const pointA = points[i];
        const pointB = points[i + 1];
        const pointC = points[j];
        const pointD = points[j + 1];
        if (this.segmentsCoises(pointA, pointB, pointC, pointD, dessinTermine)) {
          nbSegmentsCroises++;
        }
      }
    }
    return nbSegmentsCroises;
  }

  public nombreAnglesMoins45(points: any[], compteur: number, dessinTermine: boolean): number {
    let nbAnglesMoins45 = 0;
    for (let i = 1; i < points.length - 1; i++) {
      if (this.estUnAngleMoins45(i, points, compteur)) {
        nbAnglesMoins45++;
      }
    }
    if (dessinTermine) {
      if (this.estUnAngleMoins45(0, points, compteur)) {
        nbAnglesMoins45++;
      }
    }
    return nbAnglesMoins45;
  }
}
