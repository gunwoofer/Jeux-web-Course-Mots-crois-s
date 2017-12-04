import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FOV, PRES, LOIN } from './../constant';
import { MoteurDeJeuService } from './../moteurDeJeu/moteurDeJeu.service';
import * as THREE from 'three';

@Injectable()
export class JeuDeCourseService {

    private container: HTMLDivElement;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private scene: THREE.Scene;

    constructor(public moteurDeJeuService: MoteurDeJeuService) { }

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
        this.camera = new THREE.PerspectiveCamera(FOV, this.getAspectRatio(), PRES, LOIN);
        this.scene.add(this.camera);
    }

    // public configurerTours(nombreTours: number): void {
    //     this.nombreTours = nombreTours;
    //     Partie.toursAComplete = this.nombreTours;
    // }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }
}
