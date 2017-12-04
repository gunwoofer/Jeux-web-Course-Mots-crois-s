import { MoteurDeJeuService } from './../moteurDeJeu/moteurDeJeu.service';
import { GestionPartieService } from './../voiture/gestionPartie.service';
import { MondeDuJeuService } from './../mondedujeu/mondedujeu.service';
import { CollisionService } from './../voiture/collision.service';
import { Rendu } from './renduObject';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Router } from '@angular/router';

@Injectable()
export class JeuDeCourseService {

    private container: HTMLDivElement;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private renduObject = new Rendu();
    private scene: THREE.Scene;
    private routeur: Router;

    constructor(
        public collisionService: CollisionService,
        public moteurDeJeuService: MoteurDeJeuService,
        private gestionPartieService: GestionPartieService,
        private mondeDuJeuService: MondeDuJeuService) {
    }

    public obtenirScene(): THREE.Scene {
        return this.scene;
    }

    public obtenirCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public initialisation(container: HTMLDivElement): void {
        this.container = container;
        this.creerScene();
        this.moteurDeJeuService.chargerJeu(this.scene, this.camera, this.container);
        this.commencerMoteurDeJeu();
    }

    private creerScene(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 6000);
        this.scene.add(this.camera);
    }

    private commencerMoteurDeJeu(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renduObject.commencerRendu(this.renderer, this.container);
        this.moteurDeJeuService.moteurDeJeu(this.renderer, this.camera, this.container, this.scene);
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
