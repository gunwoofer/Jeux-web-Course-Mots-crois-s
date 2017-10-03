import { Injectable, Component } from '@angular/core';
import * as THREE from 'three';


@Injectable()
export class FacadeCourbeService {
    /*private dessinerCourbe(): void {
    let curve;
    const arrayPointPosition = [];
    for (const point of this.points) {
      arrayPointPosition.push(point.position);
    }
    if (this.dessinTermine) {
      arrayPointPosition.pop();
    }
    curve = new THREE.CatmullRomCurve3(arrayPointPosition);
    curve.closed = this.dessinTermine;
    const geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(100);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    this.courbe = new THREE.Line(geometry, material);
    this.scene.add(this.courbe);
  }

  private retirerCourbe(): void {
    this.scene.remove(this.courbe);
  }

  public redessinerCourbe(): void {
    if (this.courbe) {
      this.retirerCourbe();
    }
    if (this.points.length > 2) {
      this.dessinerCourbe();
    }

  }
  public viderScene(): void {
    for (let i = 0; i < this.points.length; i++) {
      this.facadeLigne.retirerAncienPointLine(this.facadePointService.compteur, this.pointsLine, this.points);
      this.scene.remove(this.points[i]);
      //this.retirerCourbe();
      this.facadePointService.compteur--;
    }
  }
  
  
  */
}