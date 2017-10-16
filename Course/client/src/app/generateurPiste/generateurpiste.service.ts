import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Piste } from '../piste/piste.model';
import { SegmentDePiste } from '../piste/segmentdepiste.model';



export const LARGEUR_PISTE = 50;
export let NOMBRE_SEGMENTS = 2;

@Injectable()
export class GenerateurPisteService {
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    private pointsPiste: THREE.Vector3[][];
    private origine: THREE.Vector3;

    private piste: Piste;

    public initialisation(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.pointsPiste = new Array(NOMBRE_SEGMENTS);
        this.container = container;
        for (let i = 0; i < this.pointsPiste.length; i++) {
            this.pointsPiste[i] = new Array();
        }
        this.creerScene();
        
        this.ajoutPisteAuPlan();

        this.commencerRendu();
    }

    public initialisationMock(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.pointsPiste = new Array(NOMBRE_SEGMENTS);
        for (let i = 0; i < this.pointsPiste.length; i++) {
            this.pointsPiste[i] = new Array();
        }
        this.container = container;
        this.creerScene();

        this.ajoutPiste();

        this.commencerRendu();
    }

    public ajouterSegmentPisteMock() {        

        const vecteurs: THREE.Vector3[] = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(50, 50, 0),
            new THREE.Vector3(150, 150, 0),
            new THREE.Vector3(250, 250, 0),
            new THREE.Vector3(350, 350, 0),
            new THREE.Vector3(450, 450, 0)
        ];
        NOMBRE_SEGMENTS = vecteurs.length / 2;

        this.piste = new Piste("bob", "bob", "bob", vecteurs);
        this.ajoutPisteAuPlan();
    }

    public ajouterPiste(piste: Piste): void {
        this.piste = piste;
    }

    public ajoutPiste() {

        this.creerPointMock();
        this.ajoutPlan();
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 1000);
        this.camera.position.y = 0;
        this.camera.position.x = 0;
        this.camera.position.z = 350;
        /*
        const lumiere = new THREE.DirectionalLight( 0xffffff );
        lumiere.position.set(0, 1, 1).normalize();
        this.scene.add(lumiere);
        */
    };

    public commencerRendu(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.render();
    };

    public render(): void {
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    };

    public getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    public ajoutCube(): void {
        const geometry = new THREE.BoxGeometry( 200, 200, 200);
        for (let i = 0; i < geometry.faces.length; i += 2 ) {
            const hex = Math.random() * 0xffffff;
            geometry.faces[ i ].color.setHex( hex );
            geometry.faces[ i + 1 ].color.setHex( hex );
        }
        const material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
        const cube = new THREE.Mesh( geometry, material );
        this.scene.add( cube );
    }

    public creerPointMock(): void {

        this.pointsPiste[0][0] = new THREE.Vector3(-33.00335554176749, 54.69665863425028, 0);
        this.pointsPiste[0][1] = new THREE.Vector3(16.57779032916467, 59.02517118804042, 0);

        this.pointsPiste[1][0] = new THREE.Vector3(16.57779032916467, 59.02517118804042, 0);
        this.pointsPiste[1][1] = new THREE.Vector3(140.5306550064982, 39.350114125359624, 0);



    }

    public ajoutPisteAuPlan(): void {
        const visuelSegments: THREE.Mesh[] = this.piste.obtenirVisuelPiste();
        for (const visuelSegmentPiste of visuelSegments) {
            this.scene.add(visuelSegmentPiste);
        }

        this.camera.lookAt(this.origine);
    }

    public ajoutPlan(): void {

        const largeur = LARGEUR_PISTE;
        const materiel = new THREE.MeshBasicMaterial( { color : 'blue' } );

        for (let duoPoint of this.pointsPiste) {
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

        this.camera.lookAt(this.origine);

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

    public cameraAvantArriere(event) {
        if (event.wheelDeltaY < 0) {
            this.camera.position.z += 5;
        } else {
                this.camera.position.z -= 5;
        }
    }

    private afficherPointConsole(point: THREE.Vector3): void {
        console.log('Coordonnees du point : x = ' + point.x + ' y = ' + point.y + ' z = ' + point.z );
    }
}
