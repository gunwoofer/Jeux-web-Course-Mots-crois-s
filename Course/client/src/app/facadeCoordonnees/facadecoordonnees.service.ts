import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class FacadeCoordonneesService {

    constructor () {}
    public mouse: THREE.Vector2;

    public obtenirIntersection(event, scene: THREE.Scene, camera: THREE.Camera, 
        renderer: THREE.WebGLRenderer): THREE.Intersection {

        const rayCaster = new THREE.Raycaster();
        this.mouse = this.obtenirCoordonnees(event, renderer);
        rayCaster.setFromCamera(this.mouse, camera);
        const intersection = rayCaster.intersectObjects(scene.children);
        return intersection[0];
    }
    public obtenirCoordonnees(event, renderer: THREE.WebGLRenderer): THREE.Vector2 {
        event.preventDefault();
        const rectangle = renderer.domElement.getBoundingClientRect();
        const vector = new THREE.Vector2();
        vector.x = ((event.clientX - rectangle.left) / (rectangle.right - rectangle.left)) * 2 - 1;
        vector.y = - ((event.clientY - rectangle.top) / (rectangle.bottom - rectangle.top)) * 2 + 1;
        return new THREE.Vector2(vector.x, vector.y);
      }

    public miseAJourMouse(event, renderer: THREE.WebGLRenderer): void {
        this.mouse = this.obtenirCoordonnees(event, renderer);
    }
}
