import {
    DELTA_ZOOM, ZOOM_AVANT, ZOOM_ARRIERE, ORIGINE, CAMERA_OFFSET_Y,
    OFFSET_VUE_DESSUS, CAMERA_OFFSET_X, CAMERA_OFFSET_Z,
    VALEUR_MAX_ZOOM, VALEUR_MIN_ZOOM
} from './../constant';
import { Injectable } from '@angular/core';
import { PerspectiveCamera, Vector3 } from 'three';
import { Voiture } from './../voiture/Voiture';


@Injectable()
export class GestionnaireDeVue {
    private etatRetroviseur;

    constructor() {
        this.etatRetroviseur = true;
    }
    public changerEtatRetroviseur(): void {
        this.etatRetroviseur = !this.etatRetroviseur;
    }

    public obtenirEtatRetroviseur(): boolean {
        return this.etatRetroviseur;
    }

    public vueDessus(camera: PerspectiveCamera, voiture: Voiture): void {
        camera.position.y = voiture.obtenirVoiture3D().position.y;
        camera.position.x = voiture.obtenirVoiture3D().position.x;
        camera.position.z = voiture.obtenirVoiture3D().position.z + OFFSET_VUE_DESSUS;
    }

    public vueTroisiemePersonne(camera: PerspectiveCamera, voiture: Voiture): void {
        const relativeCameraOffset = new Vector3(CAMERA_OFFSET_X, CAMERA_OFFSET_Y, CAMERA_OFFSET_Z)
                                    .applyMatrix4(voiture.obtenirVoiture3D().matrixWorld);
        camera.position.set(relativeCameraOffset.x, relativeCameraOffset.y, relativeCameraOffset.z);
        camera.up = new Vector3(ORIGINE, ORIGINE, ORIGINE + 1);
    }

    public changementDeVue(camera: PerspectiveCamera, voiture: Voiture): void {
        if (voiture.vueDessusTroisieme) {
            this.vueTroisiemePersonne(camera, voiture);
        } else {
            this.vueDessus(camera, voiture);
        }
        this.vueMiseAjour(camera, voiture);
    }

    public zoom(event, camera: PerspectiveCamera): void {
        if (event.key === ZOOM_AVANT && camera.zoom <= VALEUR_MAX_ZOOM) {
            camera.zoom += DELTA_ZOOM;
        }
        if (event.key === ZOOM_ARRIERE && camera.zoom > VALEUR_MIN_ZOOM) {
            camera.zoom -= DELTA_ZOOM;
        }
    }

    private vueMiseAjour(camera: PerspectiveCamera, voiture: Voiture): void {
        camera.lookAt(voiture.obtenirVoiture3D().position);
        camera.updateMatrix();
        camera.updateProjectionMatrix();
    }
}
