import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()

export class FacadeCoordonneesService {

    public mouse: THREE.Vector2;

    public obtenirIntersection(event, scene: THREE.Scene, camera: THREE.Camera,
        renderer: THREE.WebGLRenderer): THREE.Intersection {
        return this.retournerRayCaster(event, renderer, camera).intersectObjects(scene.children)[0];
    }

    private retournerRayCaster(event, renderer: THREE.WebGLRenderer, camera: THREE.Camera): THREE.Raycaster {
        this.mouse = this.obtenirCoordonneesSouris(event, renderer);
        const rayCaster = new THREE.Raycaster();
        rayCaster.setFromCamera(this.mouse, camera);

        return rayCaster;
    }

    private obtenirCoordonneesSouris(event: MouseEvent, renderer: THREE.WebGLRenderer): THREE.Vector2 {
        event.preventDefault();

        return new THREE.Vector2(
            ((event.clientX - this.clientRect(renderer).left) / (this.clientRect(renderer).right - this.clientRect(renderer).left)) * 2 - 1,
            -((event.clientY - this.clientRect(renderer).top) / (this.clientRect(renderer).bottom - this.clientRect(renderer).top)) * 2 + 1
        );
    }

    public clientRect(renderer: THREE.WebGLRenderer): ClientRect {
        return renderer.domElement.getBoundingClientRect();
    }

    public miseAJourMouse(event: MouseEvent, renderer: THREE.WebGLRenderer): void {
        this.mouse = this.obtenirCoordonneesSouris(event, renderer);
    }
}
