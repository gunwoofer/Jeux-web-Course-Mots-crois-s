import * as THREE from 'three';
import { FacadeCoordonneesService } from './facadecoordonnees.service';

export class Souris {

    public vecteurSouris: THREE.Vector2;

    public mettreAJourVecteurSouris(event: MouseEvent, renderer: THREE.WebGLRenderer): void {
        event.preventDefault();

        this.vecteurSouris =  new THREE.Vector2(
            ((event.clientX - FacadeCoordonneesService.clientRect(renderer).left) /
            (FacadeCoordonneesService.clientRect(renderer).right - FacadeCoordonneesService.clientRect(renderer).left)) * 2 - 1,
            -((event.clientY - FacadeCoordonneesService.clientRect(renderer).top) /
            (FacadeCoordonneesService.clientRect(renderer).bottom - FacadeCoordonneesService.clientRect(renderer).top)) * 2 + 1
        );
    }
}
