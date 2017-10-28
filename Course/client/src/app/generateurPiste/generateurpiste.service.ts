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
    private objetVoiture: THREE.Mesh;
    private voiture: THREE.Mesh;
    private touche: number;
    private touchePrecedente: number;
    private deplacement = new Deplacement();
    private skybox = new Skybox();
    private lambo: THREE.Object3D;

    private piste: Piste;

    public initialisation(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.pointsPiste = new Array(NOMBRE_SEGMENTS);
        this.container = container;
        for (let i = 0; i < this.pointsPiste.length; i++) {
            this.pointsPiste[i] = new Array();
        }
        this.voitureService = new Voiture(this.objetVoiture);
        this.container = container;
        this.voiture = this.voitureService.creerVoiture();
        this.creerScene();

        this.scene.add(this.voitureService.obtenirObjetVoiture3D());

        this.scene.add(this.camera);
        this.camera.add(this.skybox.creerSkybox());

        this.ajoutVoiture();

        this.ajoutPisteAuPlan();

        this.commencerRendu();
    }

    public ajouterPiste(piste: Piste): void {
        this.piste = piste;
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 1000);
        this.camera.position.y = this.voiture.position.y;
        this.camera.position.x = this.voiture.position.x;
        this.camera.position.z = 150;
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
        this.camera.position.y = this.voiture.position.y;
        this.camera.position.x = this.voiture.position.x;
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

    public ajoutVoiture(): void {
        const loader = new THREE.ObjectLoader();
        loader.load(EMPLACEMENT_VOITURE, ( obj ) => {
            obj.rotateX(1.5708);
            obj.name = 'Voiture';
            this.scene.add( obj );
            this.camera.lookAt(obj.position);
            this.obtenirVoiture();
        });
    }

    public obtenirVoiture() {
        this.lambo = this.scene.getChildByName('Voiture');
    }
}
