import { Segment } from './../piste/segment.model';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/voiture.service';

import { Piste } from '../piste/piste.model';
export const LARGEUR_PISTE = 5;
export let NOMBRE_SEGMENTS = 1;


@Injectable()
export class GenerateurPisteService {
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    private pointsPiste: THREE.Vector3[][];
    private origine: THREE.Vector3;
    private automobile: Voiture;
    private objetVoiture: THREE.Mesh;
    private touche: number;
    private touchePrecedente: number;

    private piste: Piste;

    public initialisation(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.pointsPiste = new Array(NOMBRE_SEGMENTS);
        this.container = container;
        for (let i = 0; i < this.pointsPiste.length; i++) {
            this.pointsPiste[i] = new Array();
        }
        this.automobile = new Voiture(this.objetVoiture);
        this.container = container;
        this.creerScene();

        this.automobile.creerVoiture();
        this.scene.add(this.automobile.obtenirObjetVoiture3D());

        this.ajoutPisteAuPlan();

        this.commencerRendu();
    }

    public ajouterPiste(piste: Piste): void {
        this.piste = piste;
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 1000);
        this.camera.position.y = 0;
        this.camera.position.x = 0;
        this.camera.position.z = 350;
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
        /*
        Gauche = 97
        Gauche touche relachee = 65
        Droite = 100
        Droite touche relachee = 68
        Avancer = 119
        Avancer touche relachee = 87
        Reculer = 115
        Reculer touche relachee = 83
        */
        if (event.keyCode === 119) {
            this.automobile.obtenirObjetVoiture3D().translateY(1);
            this.touchePrecedente = this.touche;
            this.touche = 119;
            if (this.touchePrecedente === 97) {
                this.automobile.obtenirObjetVoiture3D().translateX(-1);
                this.touche = 97;
                event.keyCode = 97;
            }
            if (this.touchePrecedente === 100) {
                this.automobile.obtenirObjetVoiture3D().translateX(1);
                this.touche = 100;
            }
        }
        if (event.keyCode === 115) {
            this.automobile.obtenirObjetVoiture3D().translateY(-1);
            this.touchePrecedente = this.touche;
            this.touche = 115;
           if (this.touchePrecedente === 97) {
                this.automobile.obtenirObjetVoiture3D().translateX(-1);
                this.touche = 97;
            }
            if (this.touchePrecedente === 100) {
                this.automobile.obtenirObjetVoiture3D().translateX(1);
                this.touche = 100;
            }
        }
        if (event.keyCode === 97) {
            this.touchePrecedente = this.touche;
            this.touche = 97 ;
            this.automobile.obtenirObjetVoiture3D().translateX(-1);

            if (this.touchePrecedente === 119) {
                this.automobile.obtenirObjetVoiture3D().translateY(1);
                this.touche = 119;
            }
            if (this.touchePrecedente === 115) {
                this.automobile.obtenirObjetVoiture3D().translateY(-1);
                this.touche = 115;
            }
        }
        if (event.keyCode === 100 ) {
            this.touchePrecedente = this.touche;
            this.touche = 100;
            this.automobile.obtenirObjetVoiture3D().translateX(1);
            if (this.touchePrecedente === 119) {
                this.automobile.obtenirObjetVoiture3D().translateY(1);
                this.touche = 119;

            }
            if (this.touchePrecedente === 115) {
                this.automobile.obtenirObjetVoiture3D().translateY(-1);
                this.touche = 115;
            }
        }

    }

    public toucheRelachee(event): void {
        // 90 Z
        // 83 S
        // 68 D
        // 81 Q
        // 65 A
        // 87 W
       if (event.keyCode === 87) {
            this.touche = 0;
        }
        if (event.keyCode === 83) {
            this.touche = 0;
        }
        if (event.keyCode === 65) {
            this.touche = 0;
        }
        if (event.keyCode === 68) {
            this.touche = 0;
        }

    }

    public ajoutVoiture(): void {
        const loader = new THREE.ObjectLoader();
        loader.load('../../assets/modeles/audi/audioptimised02.json', ( obj ) => {
            this.scene.add( obj );
            this.camera.lookAt(obj.position);
        });

    }
}
