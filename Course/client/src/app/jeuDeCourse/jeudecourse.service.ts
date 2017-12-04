import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Router } from '@angular/router';
import { FOV, PRES, LOIN} from './../constant';
import { MoteurDeJeuService } from './../moteurDeJeu/moteurDeJeu.service';

@Injectable()
export class JeuDeCourseService {

    private container: HTMLDivElement;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;
    private routeur: Router;

    constructor(public moteurDeJeuService: MoteurDeJeuService) {}

    public obtenirScene(): THREE.Scene {
        return this.scene;
    }

    public obtenirCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public initialisation(container: HTMLDivElement): void {
        this.container = container;
        this.creerScene();
        this.moteurDeJeuService.commencerMoteurDeJeu(this.renderer, this.camera, this.container, this.scene);
    }

    private creerScene(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 6000);
        this.scene.add(this.camera);
    }

    public ajouterRouter(routeur: Router): void {
        this.routeur = routeur;
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }
}
