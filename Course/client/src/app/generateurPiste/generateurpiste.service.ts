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
        this.ajoutCube();
        this.commencerRendu();
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xFFFFFF);
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 1000);
        this.camera.position.y = 150;
        this.camera.position.z = 500;
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
        cube.position.y = 150;
        this.scene.add( cube );
    }
}
