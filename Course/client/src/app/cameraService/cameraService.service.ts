import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';


@Injectable()
export class CameraService {

    public vueMiseAjour(camera: THREE.PerspectiveCamera, voiture: Voiture): void {
        camera.lookAt(voiture.obtenirVoiture3D().position);
        camera.updateMatrix();
        camera.updateProjectionMatrix();
    }

    public vueDessus(camera: THREE.PerspectiveCamera, voiture: Voiture): void {
        camera.position.y = voiture.obtenirVoiture3D().position.y;
        camera.position.x = voiture.obtenirVoiture3D().position.x;
        camera.position.z = voiture.obtenirVoiture3D().position.z + 50;
    }

    public vueTroisiemePersonne(camera: THREE.PerspectiveCamera, voiture: Voiture): void {
        let relativeCameraOffset = new THREE.Vector3(-5, 2, 0);
        relativeCameraOffset = relativeCameraOffset.applyMatrix4(voiture.obtenirVoiture3D().matrixWorld);
        camera.position.set(relativeCameraOffset.x, relativeCameraOffset.y, relativeCameraOffset.z);
        camera.up = new THREE.Vector3(0, 0, 1);
    }

    public changementDeVue(camera: THREE.PerspectiveCamera, voiture: Voiture): void {
        if (voiture.vueDessusTroisieme) {
            this.vueTroisiemePersonne(camera, voiture);
        } else {
            this.vueDessus(camera, voiture);
        }
        this.vueMiseAjour(camera, voiture);
    }

    public zoom(event, camera: THREE.PerspectiveCamera): void {
        if (event.key === '+' && camera.zoom <= 5) {
            camera.zoom += .5;
        }
        if (event.key === '-' && camera.zoom > 1) {
            camera.zoom -= .5;
        }
    }
}
