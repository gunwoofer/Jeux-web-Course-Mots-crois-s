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
    public pointsLine: Line;
    public nbSegmentsCroises = 0;
    public nbAnglesPlusPetit45 = 0;
    public nbSegmentsTropProche = 0;

    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private points: PointsFacade[] = new Array();
    private dessinTermine = false;

    private contraintesCircuit = new ContraintesCircuit();
    private listePointElementPiste: THREE.Points[] = new Array();
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

    public obtenirPoints(): PointsFacade[] {
        return this.points;
    }

    public obtenirDessinTermine(): boolean {
        return this.dessinTermine;
    }

    public initialize(container: HTMLDivElement): void {
        this.container = container;
        this.scene = this.creerScene();
        this.creerPlan();
        this.initialisationLigne();

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

    public initialisationLigne(): void {
        this.pointsLine = FacadeLigneService.creerLignePoints();
        this.scene.add(this.pointsLine);
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

    public ajouterPoint(point: PointsFacade): void {
        if (!this.dessinTermine) {
            this.scene.add(point);
        }
        FacadeLigneService.ajouterLignePoints(point.position, this.facadePointService.compteur, this.pointsLine, this.points);
        this.points.push(point);
        this.facadePointService.compteur++;
    }

    public supprimerPoint(): void {
        this.dessinTermine = false;
        this.scene.remove(this.points[this.points.length - 1]);
        this.points.pop();
        this.actualiserDonnees();
        FacadeLigneService.retirerAncienlignePoints(this.facadePointService.compteur, this.pointsLine, this.points);
        if (this.facadePointService.compteur >= 1) {
            this.facadePointService.compteur--;
        }
    }

    public dessinerPoint(event): void {
        let objet, point;

        if (!this.dessinTermine) {
            objet = this.facadeCoordonneesService.obtenirIntersection(event, this.scene, this.camera, this.renderer);
            point = this.facadePointService.creerPoint(objet.point, 'black');
            if (this.points.length === 0) {
                point.material.status = 'premier';
            } else {
                try {
                    this.dessinerDernierPoint(point);
                } catch (e) {
                    alert(e.message);
                        return;
                }
            }
            this.ajouterPoint(point);
            this.actualiserDonnees();
            this.render();
        } else {
            return;
        }
    }

    public dessinerDernierPoint(point): void {
        const distance = point.position.distanceTo(this.points[0].position);
        if (distance >= 0 && distance < 3) {
            if (this.points.length > 2) {
                point.position.copy(this.points[0].position);
                this.dessinTermine = true;
            } else {
                throw new Error('une piste a trois points minimum');
            }
        }
    }

    public retourneEtatDessin(): boolean {
        if (this.nbAnglesPlusPetit45 + this.nbSegmentsCroises + this.nbSegmentsTropProche === 0) {
            return this.dessinTermine;
        } else {
            return false;
        }
    }

    public actualiserContrainte(): void {
        this.nbSegmentsCroises = this.contraintesCircuit.nombreLignesCroisees(this.points, this.dessinTermine);
        this.nbSegmentsTropProche = this.contraintesCircuit.nombreSegmentsTropCourts(this.points);
        this.nbAnglesPlusPetit45 = this.contraintesCircuit.nombreAnglesMoins45(
            this.points, this.facadePointService.compteur, this.dessinTermine
        );
    }

    public actualiserDonnees(): void {
        FacadePointService.restaurerStatusPoints(this.points);
        this.actualiserContrainte();
        FacadePointService.actualiserCouleurPoints(this.points);
    }

    public viderScene(): void {
        for (let i = 0; i < this.points.length; i++) {
            FacadeLigneService.retirerAncienlignePoints(this.facadePointService.compteur, this.pointsLine, this.points);
            this.scene.remove(this.points[i]);
            this.facadePointService.compteur--;
        }
    }

    public reinitialiserScene(): void {
        this.viderScene();
        this.viderElementsPiste();
        FacadePointService.viderListeDesPoints(this.points);
        this.dessinTermine = false;
    }

    public chargerPiste(position: any): void {
        for (let i = 0; i < position.length; i++) {
            this.dessinerPointDejaConnu(position[i]);
        }
    }

    public obtenirPositions(): THREE.Vector3[] {
        const vecteur: THREE.Vector3[] = new Array();

        for (const point of this.points) {
            vecteur.push(new THREE.Vector3(point.position.x, point.position.y, point.position.z));
        }

        return vecteur;
    }

    public afficherElementsDePiste(listeElement: ElementDePiste[]): void {
        this.viderElementsPiste();
        let couleur: string;

        for (const element of listeElement) {
            if (element instanceof FlaqueDEau) {
                couleur = '#ff0000';
            } else if (element instanceof NidDePoule) {
                couleur = '#0000ff';
            } else if (element instanceof Accelerateur) {
                couleur = '#f9d500';
            }

            const point = this.facadePointService.creerPoint(element.position, couleur);
            this.scene.add(point);
            this.listePointElementPiste.push(point);
        }
    }

    public dessinerPointDejaConnu(position: THREE.Vector3): void {
        let point;

        if (!this.dessinTermine) {
            point = this.facadePointService.creerPoint(position, 'black');

            if (this.points.length === 0) {
                point.material.status = 'premier';
            } else {
                try {
                this.dessinerDernierPoint(point);
                } catch (e) {
                    alert(e.message);
                    return;
                }
            }

            this.ajouterPoint(point);
            this.actualiserDonnees();
            this.render();
        } else {
            return;
        }
    }

    private viderElementsPiste(): void {
        for (const point of this.listePointElementPiste) {
            this.scene.remove(point);
        }
    }
}
