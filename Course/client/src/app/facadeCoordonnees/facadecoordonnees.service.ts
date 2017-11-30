import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class FacadeCoordonneesService {

    public mouse: THREE.Vector2;

    public obtenirIntersection( event, scene: THREE.Scene, camera: THREE.Camera,
                                renderer: THREE.WebGLRenderer): THREE.Intersection {

        this.mouse = this.obtenirCoordonnees(event, renderer);
        const rayCaster = new THREE.Raycaster();
        rayCaster.setFromCamera(this.mouse, camera);

        return rayCaster.intersectObjects(scene.children)[0];
    }

    private obtenirCoordonnees(event: MouseEvent, renderer: THREE.WebGLRenderer): THREE.Vector2 {
        event.preventDefault();

        const rectangle = renderer.domElement.getBoundingClientRect();
        const vector = new THREE.Vector2();

        return new THREE.Vector2(
            ((event.clientX - rectangle.left) / (rectangle.right - rectangle.left)) * 2 - 1,
            -((event.clientY - rectangle.top) / (rectangle.bottom - rectangle.top)) * 2 + 1
        );
    }

    public miseAJourMouse(event: MouseEvent, renderer: THREE.WebGLRenderer): void {
        this.mouse = this.obtenirCoordonnees(event, renderer);
    }
}
