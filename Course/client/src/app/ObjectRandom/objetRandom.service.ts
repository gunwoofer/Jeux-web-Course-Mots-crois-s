import { Injectable } from '@angular/core';
import * as THREE from 'three';


@Injectable()
export class ObjetRandomService {
    private WIDTH = 10000;
    private HEIGHT = 10000;
    private arbrePath = '../../assets/objects/arbre/tree.json';
    private arbreTexture = '../../assets/objects/arbre/tree.jpg';
    private arbrePath2 = '../../assets/objects/arbre2/tree.json';
    private arbreTexture2 = '../../assets/objects/arbre2/tree.jpg';
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public plane: THREE.Mesh;
    public scene: THREE.Scene;

    public initialisation(container: HTMLDivElement) {
        this.container = container;
        this.creerScene();
        this.scene.add(this.camera);
        const axesHelper = new THREE.AxisHelper(100);
        this.scene.add(axesHelper);
        this.creeplane();
        this.chargerArbre(this.arbrePath, this.arbreTexture);
        this.commencerRendu();
    }

    public creerScene(): void {
        // vue 2 èeme personne

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(30, this.getAspectRatio(), 1, 5000);
        this.camera.rotateZ(Math.PI / 2);
        this.camera.position.y = 5000;
        const vecteur1 = new THREE.Vector3(0, 0, 0);
        this.camera.lookAt(vecteur1);

        // vue 3 ème personne

        // this.scene = new THREE.Scene();
        // this.camera = new THREE.PerspectiveCamera(30, this.getAspectRatio(), 1, 5000);
        // this.camera.position.z = 10;
        // this.camera.position.y = 100;
        // const vecteur1 = new THREE.Vector3(0, 0, 0);
        // this.camera.lookAt(vecteur1);
    }

    public creeplane(): void {
        const geometry = new THREE.PlaneGeometry(10000, 10000, 32);
        const material = new THREE.MeshBasicMaterial({ color: 'pink', side: THREE.DoubleSide });
        this.plane = new THREE.Mesh(geometry, material);
        this.plane.rotateX(Math.PI / 2);
        this.scene.add(this.plane);
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


    public random(min, max): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public genereRandomPosition(vecteur: THREE.Vector3): void {
        vecteur.x = this.random(-this.WIDTH / 10, this.WIDTH / 10);
        vecteur.z = this.random(-this.WIDTH / 10, this.WIDTH / 10);
        vecteur.y = 0;
    }

    public chargerArbre(path: string, texture: string): void {
        const loader = new THREE.ObjectLoader();
        const groupe = new THREE.Object3D();
        let arbre: any; let lumieres: any; let instance: any;
        const textur = new THREE.TextureLoader().load(texture);
        loader.load(path, (obj) => {
            arbre = obj.children[1];
            lumieres = obj.children[0];
            arbre.material.map = textur;
            for (let i = 0; i < 25; i++) {
                instance = arbre.clone();
                this.genereRandomPosition(instance.position);
                groupe.add(instance);
            }
            this.scene.add(lumieres);
        });
        this.scene.add(groupe);
    }
}



