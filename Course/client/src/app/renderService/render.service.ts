import { CreateurPisteService } from './../createurPiste/createurPiste.service';
import { PointsFacade } from './../pointsFacade';
import { Accelerateur } from './../elementsPiste/Accelerateur';
import { NidDePoule } from './../elementsPiste/NidDePoule';
import { FlaqueDEau } from './../elementsPiste/FlaqueDEau';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FacadePointService } from '../facadePoint/facadepoint.service';
import { FacadeCoordonneesService } from '../facadeCoordonnees/facadecoordonnees.service';
import { ContraintesCircuit } from '../contraintesCircuit/contraintesCircuit';
import { Piste } from '../piste/piste.model';
import { ElementDePiste } from '../elementsPiste/ElementDePiste';
import { Points, Line } from 'three';
import { FacadeLigneService } from '../facadeLigne/facadeLigne.service';

@Injectable()
export class RenderService {

    public scene: THREE.Scene;

    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private facadeCoordonneesService = new FacadeCoordonneesService();
    private plane: THREE.Mesh;
    private container: HTMLDivElement;

    constructor(public facadePointService: FacadePointService,
                private createurPisteService: CreateurPisteService) {}

    public obtenirCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public obtenirRenderer(): THREE.WebGLRenderer {
        return this.renderer;
    }

    public initialize(container: HTMLDivElement): void {
        this.container = container;
        this.scene = this.creerScene();
        this.creerPlan();
        this.ajouterLigneALaScene();

        if (this.createurPisteService.pisteAmodifie) {
            this.chargerPiste(this.createurPisteService.pisteAmodifie.listepositions);
        }

        this.startRenderingLoop();
    }

    public creerScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xFFFFFF);
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 10000);
        this.camera.position.z = 100;
        this.camera.position.x = 100;
        return scene;
    }

    public creerPlan(): void {
        const geometry = new THREE.PlaneGeometry(this.container.clientWidth, this.container.clientHeight);
        const planeMaterial = new THREE.MeshBasicMaterial({
            visible: false
        });
        this.plane = new THREE.Mesh(geometry, planeMaterial);
        this.scene.add(this.plane);
    }

    public ajouterLigneALaScene(): void {
        this.createurPisteService.initialisationLigne();
        this.scene.add(this.createurPisteService.pointsLine);
    }

    public startRenderingLoop(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    public render(): void {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    public supprimerPoint(): void {
        this.createurPisteService.dessinTermine = false;
        this.scene.remove(this.createurPisteService.points[this.createurPisteService.points.length - 1]);
        this.createurPisteService.points.pop();
        this.actualiserDonnees();
        FacadeLigneService.retirerAncienlignePoints(this.facadePointService.compteur,
                                                    this.createurPisteService.pointsLine, this.createurPisteService.points);
        if (this.facadePointService.compteur >= 1) {
            this.facadePointService.compteur--;
        }
    }

    public retourneEtatDessin(): boolean {
        if (this.createurPisteService.nbAnglesPlusPetit45 + this.createurPisteService.nbSegmentsCroises + 
                this.createurPisteService.nbSegmentsTropProche === 0) {
            return this.createurPisteService.dessinTermine;
        } else {
            return false;
        }
    }

    public actualiserDonnees(): void {
        FacadePointService.restaurerStatusPoints(this.createurPisteService.points);
        this.createurPisteService.actualiserContrainte(this.createurPisteService.points, this.createurPisteService.dessinTermine);
        FacadePointService.actualiserCouleurPoints(this.createurPisteService.points);
    }

    public viderScene(): void {
        for (let i = 0; i < this.createurPisteService.points.length; i++) {
            FacadeLigneService.retirerAncienlignePoints(this.facadePointService.compteur,
                                                        this.createurPisteService.pointsLine, this.createurPisteService.points);
            this.scene.remove(this.createurPisteService.points[i]);
            this.facadePointService.compteur--;
        }
    }

    public reinitialiserScene(): void {
        this.viderScene();
        this.createurPisteService.viderElementsPiste(this.scene);
        FacadePointService.viderListeDesPoints(this.createurPisteService.points);
        this.createurPisteService.dessinTermine = false;
    }

    public chargerPiste(position: any): void {
        for (let i = 0; i < position.length; i++) {
            this.createurPisteService.dessinerPointDejaConnu(position[i], this.scene);
            if (!this.createurPisteService.dessinTermine) {
                this.actualiserDonnees();
                this.render();
            }
        }
    }
}
