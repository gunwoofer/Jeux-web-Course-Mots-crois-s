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

}
