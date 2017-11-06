import { Skybox } from './../skybox/skybox.model';
import { Deplacement } from './deplacement';
import { Segment } from './../piste/segment.model';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';

import { Piste } from '../piste/piste.model';
export const LARGEUR_PISTE = 5;
export let NOMBRE_SEGMENTS = 1;
const EMPLACEMENT_VOITURE = '../../assets/modeles/lamborghini/lamborghini-aventador-pbribl.json';


@Injectable()
export class GenerateurPisteService {
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    private pointsPiste: THREE.Vector3[][];
    private origine: THREE.Vector3;
    private voitureDuJoueur: Voiture;
    private touche: number;
    private touchePrecedente: number;
    private deplacement = new Deplacement();
    private skybox = new Skybox();
    private voiture: THREE.Object3D;
    private piste: Piste;

    public initialisation(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.pointsPiste = new Array(NOMBRE_SEGMENTS);
        this.container = container;
        for (let i = 0; i < this.pointsPiste.length; i++) {
            this.pointsPiste[i] = new Array();
        }
        this.container = container;
        this.creerScene();
        this.scene.add(this.camera);
        this.camera.add(this.skybox.creerSkybox());
        this.chargerVoiture();
        this.ajoutPisteAuPlan();
        this.commencerRendu();
    }

    public ajouterPiste(piste: Piste): void {
        this.piste = piste;
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 1000);
    }

    public commencerRendu(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    public render(): void {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
        if (this.voiture !== undefined) {
            if (this.voitureDuJoueur.vueDessusTroisieme) {
                this.vueTroisiemePersonne();
            } else {
                this.vueDessus();
            }
            this.vueMiseAjour();
        }
    }

    public renderMiseAJour(): void {
        this.renderer.render(this.scene, this.camera);
        if (this.voiture !== undefined) {
            if (this.voitureDuJoueur.vueDessusTroisieme) {
                this.vueTroisiemePersonne();
            } else {
                this.vueDessus();
            }
            this.vueMiseAjour();
        }
    }

    public vueMiseAjour(): void {
        this.camera.lookAt(this.voiture.position);
        this.camera.updateMatrix();
        this.camera.updateProjectionMatrix();
    }

    public vueDessus(): void {
        this.camera.position.y = this.voiture.position.y;
        this.camera.position.x = this.voiture.position.x;
        this.camera.position.z = this.voiture.position.z + 50;
    }

    public vueTroisiemePersonne(): void {
        let relativeCameraOffset = new THREE.Vector3(-8, 8, 0);
        relativeCameraOffset = relativeCameraOffset.applyMatrix4(this.voiture.matrixWorld);
        this.camera.position.set(relativeCameraOffset.x, relativeCameraOffset.y, relativeCameraOffset.z);
        this.camera.up = new THREE.Vector3(0, 0, 1);
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    public ajoutPisteAuPlan(): void {
        const segmentsPisteVisuel: THREE.Mesh[] = Segment.chargerSegmentsDePiste(this.piste);

        for (let i = 0 ; i < segmentsPisteVisuel.length; i++) {
            this.scene.add(segmentsPisteVisuel[i]);
        }
    }

    public deplacementVoiture(event): void {
        this.voitureDuJoueur.vitesse += 0.05;
        this.deplacement.deplacementVoiture(event, this.voitureDuJoueur.obtenirVoiture3D(),
                this.touche, this.touchePrecedente, this.voitureDuJoueur);
        this.renderMiseAJour();

    }

    public toucheRelachee(event): void {
        this.voitureDuJoueur.vitesse = 0;
        this.deplacement.toucheRelachee(event, this.touche);
    }

    public chargerVoiture(): void {
        const loader = new THREE.ObjectLoader();
        loader.load(EMPLACEMENT_VOITURE, ( obj ) => {
            obj.rotateX(Math.PI / 2);
            obj.name = 'Voiture';
            this.scene.add( obj );
            this.voiture = obj;
            this.voitureDuJoueur = new Voiture(this.voiture);
        });
    }

    public zoom(event): void {
        if (event.key === '+' && this.camera.zoom <= 5) {
            this.camera.zoom += .5;
        }
        if (event.key === '-' && this.camera.zoom > 1) {
            this.camera.zoom -= .5;
        }
    }
}
