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
}
