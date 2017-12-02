import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Souris } from './souris';

@Injectable()

export class FacadeCoordonneesService {

    public souris: Souris = new Souris();

    public static clientRect(renderer: THREE.WebGLRenderer): ClientRect {
        return renderer.domElement.getBoundingClientRect();
    }

    public obtenirIntersection(event, scene: THREE.Scene, camera: THREE.Camera,
        renderer: THREE.WebGLRenderer): THREE.Intersection {
        return this.retournerRayCaster(event, renderer, camera).intersectObjects(scene.children)[0];
    }

    private retournerRayCaster(event, renderer: THREE.WebGLRenderer, camera: THREE.Camera): THREE.Raycaster {
        this.souris.mettreAJourVecteurSouris(event, renderer);
        const rayCaster = new THREE.Raycaster();
        rayCaster.setFromCamera(this.souris.vecteurSouris, camera);

        return rayCaster;
    }
}
