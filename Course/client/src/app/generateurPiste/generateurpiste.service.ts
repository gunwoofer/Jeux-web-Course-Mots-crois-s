import { Injectable } from '@angular/core';
import * as THREE from 'three';

export const LARGEUR_PISTE = 50;
export const NOMBRE_SEGMENTS = 1;

@Injectable()
export class GenerateurPisteService {
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    private pointsPiste: THREE.Vector3[][];
    private origine: THREE.Vector3;
    private voiture: THREE.Mesh;

    public initialisation(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.pointsPiste = new Array(NOMBRE_SEGMENTS);
        for (let i = 0; i < this.pointsPiste.length; i++) {
            this.pointsPiste[i] = new Array();
        }
        this.container = container;
        this.creerScene();
        this.creerPointMock();
        this.creerVoiture();
        this.scene.add(this.voiture);
        this.commencerRendu();
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x00FF00);
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
        const material = new THREE.MeshBasicMaterial( { color: 'white', overdraw: 0.5 } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.y = 10;
        cube.position.x = 0;
        cube.position.z = 0;
        this.voiture = cube;
    }

    public creerPointMock(): void {

        this.pointsPiste[0][0] = new THREE.Vector3(0, 0, 0);
        this.pointsPiste[0][1] = new THREE.Vector3(0, 100, 0);

    }

    public ajoutPlan(): void {
        const largeur = LARGEUR_PISTE;
        const materiel = new THREE.MeshBasicMaterial( { color : 'black' } );

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

    public deplacementVoiture(event) {
        console.log(event.keyCode);
        if (event.keyCode === 122 || event.keyCode === 119) {
            console.log('Avancer');
            this.voiture.translateY(1);
        }
        if (event.keyCode === 115) {
            console.log('Reculer');
            this.voiture.translateY(-1);
        }
        if (event.keyCode === 113 || event.keyCode === 97) {
            console.log('Gauche');
            this.voiture.translateX(-1);
        }
        if (event.keyCode === 100) {
            console.log('Droite');
            this.voiture.translateX(1);
        }
    }
}
