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
    private voiture: THREE.Mesh;
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

    public initialisationMock(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.pointsPiste = new Array(NOMBRE_SEGMENTS);
        for (let i = 0; i < this.pointsPiste.length; i++) {
            this.pointsPiste[i] = new Array();
        }
        this.creerScene();

        this.ajoutPiste();

        this.commencerRendu();
    }

    public ajouterSegmentPisteMock(): void {

        const vecteurs: THREE.Vector3[] = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(50, 50, 0),
            new THREE.Vector3(150, 150, 0),
            new THREE.Vector3(250, 250, 0),
            new THREE.Vector3(350, 350, 0),
            new THREE.Vector3(450, 450, 0)
        ];
        NOMBRE_SEGMENTS = vecteurs.length / 2;

        this.piste = new Piste('bob', 'bob', 'bob', vecteurs);
        this.ajoutPisteAuPlan();
    }

    public ajouterPiste(piste: Piste): void {
        this.piste = piste;
    }

    public ajoutPiste(): void {

        this.creerPointMock();
        this.automobile.creerVoiture();
        this.scene.add(this.automobile.obtenirObjetVoiture3D());
        this.commencerRendu();
        this.ajoutPlan();
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

    public creerVoiture(): void {
        const geometry = new THREE.BoxGeometry( 10, 10, 10);
        const loader = new THREE.TextureLoader();
        const texture = loader.load('../../assets/textures/clouds.jpg');

        const material = new THREE.MeshBasicMaterial( { color: 'white', overdraw: 0.5, map: texture } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.y = 10;
        cube.position.x = 0;
        cube.position.z = 0;
        this.voiture = cube;

    }

    public creerPointMock(): void {

        this.pointsPiste[0][0] = new THREE.Vector3(-33.00335554176749, 54.69665863425028, 0);
        this.pointsPiste[0][1] = new THREE.Vector3(16.57779032916467, 59.02517118804042, 0);

        this.pointsPiste[1][0] = new THREE.Vector3(16.57779032916467, 59.02517118804042, 0);
        this.pointsPiste[1][1] = new THREE.Vector3(140.5306550064982, 39.350114125359624, 0);



    }

    public ajoutPisteAuPlan(): void {
        const segmentsPisteVisuel: THREE.Mesh[] = Segment.chargerSegmentsDePiste(this.piste);

        for(let i = 0 ; i < segmentsPisteVisuel.length; i++) {
            this.scene.add(segmentsPisteVisuel[i]);
        }
    }

    public ajoutPlan(): void {

        const largeur = LARGEUR_PISTE;
        const materiel = new THREE.MeshBasicMaterial( { color : 'blue' } );

        for (const duoPoint of this.pointsPiste) {
            const pointDebut: THREE.Vector3 = duoPoint[0];
            const pointFin: THREE.Vector3 = duoPoint[1];

            const longueur = this.obtenirLongueur(pointDebut, pointFin);
            const geometrie = new THREE.PlaneGeometry(largeur, longueur);
            const angle = this.obtenirAngle(pointDebut, pointFin);
            const plan = new THREE.Mesh(geometrie, materiel);
            plan.rotateZ(angle);
            plan.position.x = (pointDebut.x + pointFin.x) / 2;
            plan.position.y = (pointDebut.y + pointFin.y) / 2;
            this.scene.add(plan);
        }
        this.vueDuDessus(this.automobile.obtenirPositionVoiture());
    }

    private obtenirLongueur(pointDebut: THREE.Vector3, pointFin: THREE.Vector3): number {
        const longueur: number = Math.sqrt(
            Math.pow(pointFin.x - pointDebut.x, 2) + Math.pow(pointFin.y - pointDebut.y, 2) + Math.pow(pointFin.z - pointDebut.z, 2)
        );
        return longueur;
    }

    private obtenirAngle(pointDebut: THREE.Vector3, pointFin: THREE.Vector3): number {
        const angle: number = Math.atan((pointFin.y - pointDebut.y) / (pointFin.x - pointDebut.x));
        return angle;
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

    private vueDuDessus(centreVoiture: THREE.Vector3): void {
        this.camera.lookAt(this.automobile.obtenirPositionVoiture());
    }
}
