import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class GenerateurPisteService {
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;

    public initialisation(container: HTMLDivElement) {
        this.container = container;
        this.creerScene();
        this.ajoutPlan();
        this.commencerRendu();
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xFFFFFF);
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 1000);
        this.camera.position.y = 0;
        this.camera.position.x = 0;
        this.camera.position.z = 350;
        /*
        const lumiere = new THREE.DirectionalLight( 0xffffff );
        lumiere.position.set(0, 1, 1).normalize();
        this.scene.add(lumiere);
        */
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

    public ajoutCube(): void {
        const geometry = new THREE.BoxGeometry( 200, 200, 200);
        for (let i = 0; i < geometry.faces.length; i += 2 ) {
            const hex = Math.random() * 0xffffff;
            geometry.faces[ i ].color.setHex( hex );
            geometry.faces[ i + 1 ].color.setHex( hex );
        }
        const material = new THREE.MeshBasicMaterial( { vertexColors: THREE.FaceColors, overdraw: 0.5 } );
        const cube = new THREE.Mesh( geometry, material );
        cube.position.y = 0;
        cube.position.x = 0;
        cube.position.z = 0;
        this.scene.add( cube );
        this.camera.lookAt(cube.position);
    }

    public ajoutPlan(): void {
        const pointDebut = new THREE.Vector3(0, 0, 0);
        const pointFin = new THREE.Vector3(20, 14, 0);

        const largeur = 50;
        const longeur = Math.sqrt(
            Math.pow(pointFin.x - pointDebut.x, 2) + Math.pow(pointFin.y - pointDebut.y, 2) + Math.pow(pointFin.z - pointDebut.z, 2)
        );
        const geometrie = new THREE.PlaneGeometry(largeur, longeur);

        const materiel = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('./textures/clouds.jpg') } );

        const plan = new THREE.Mesh(geometrie, materiel);

        this.scene.add(plan);

        this.camera.lookAt(plan.position);
    }

    public cameraAvantArriere(event) {
        if (event.wheelDeltaY < 0) {
            this.camera.position.z += 5;
        } else {
                this.camera.position.z -= 5;
        }
    }
}
