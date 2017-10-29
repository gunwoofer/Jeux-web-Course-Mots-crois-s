import { Skybox } from './../skybox/skybox.model';
import { Deplacement } from './deplacement';
import { Segment } from './../piste/segment.model';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/voiture.service';

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
    private voitureService: Voiture;
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
        this.voitureService = new Voiture();
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
        this.camera.position.z = 50;
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
            this.vueTroisiemePersonne();
        }
    }

    public vueDessus(): void {
        this.camera.position.y = this.voiture.position.y;
        this.camera.position.x = this.voiture.position.x;
        this.camera.lookAt(this.voiture.position);
    }


    public vueTroisiemePersonne(): void {

        this.camera.position.y = this.voiture.position.y - 20;
        this.camera.position.x = this.voiture.position.x;
        this.camera.position.z = this.voiture.position.z + 15;

        const relativeCameraOffset = new THREE.Vector3(0, -20, 15);

        const cameraOffset = relativeCameraOffset.applyMatrix4(this.voiture.matrixWorld);

        this.camera.position.x = cameraOffset.x;
        this.camera.position.y = cameraOffset.y;
        this.camera.updateMatrix();
        this.camera.updateProjectionMatrix();
        // Eviter que la camera ne roule sur elle meme
        this.camera.up = new THREE.Vector3(0, 0, 1);
        this.camera.lookAt(this.voiture.position);
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

    public cameraAvantArriere(event): void {
        if (event.wheelDeltaY < 0) {
            this.camera.position.z += 5;
        } else {
                this.camera.position.z -= 5;
        }
    }

    public deplacementVoiture(event): void {
        this.voitureService.vitesse += 0.05;
        this.deplacement.deplacementVoiture(event, this.voiture, this.touche, this.touchePrecedente, this.voitureService.vitesse);

    }

    public toucheRelachee(event): void {
        this.voitureService.vitesse = 0;
        this.deplacement.toucheRelachee(event, this.touche);
    }

    public chargerVoiture(): void {
        const loader = new THREE.ObjectLoader();
        loader.load(EMPLACEMENT_VOITURE, ( obj ) => {
            obj.rotateX(1.5708);
            obj.rotateY(Math.PI / 2);
            obj.name = 'Voiture';
            this.scene.add( obj );
            this.voiture = obj;
        });
    }
}
