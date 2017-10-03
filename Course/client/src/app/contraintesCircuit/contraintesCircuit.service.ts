import { Injectable, Component } from '@angular/core';
import * as THREE from 'three';

import { RenderService } from '../renderService/render.service';

@Injectable()
export class ContraintesCircuitService {
  public calculerAngle(numeroPoint: number, points: any[], compteur: number): number {
    if (points.length > 1) {
      const point1 = points[numeroPoint === 0 ? compteur - 1 : numeroPoint - 1];
      const point2 = points[numeroPoint];
      const point3 = points[numeroPoint + 1];
      const premierSegment = new THREE.Vector2(point3.position.x - point2.position.x, point3.position.y - point2.position.y).normalize();
      const precedentSegement = new THREE.Vector2(point2.position.x - point1.position.x, point2.position.y - point1.position.y).normalize();
      const produitScalaire = (premierSegment.x) * (-precedentSegement.x) + (premierSegment.y) * (-precedentSegement.y);
      const angle = Math.acos(produitScalaire);
      return angle;
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
}
