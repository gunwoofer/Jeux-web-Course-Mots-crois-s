import { filtreCouleur } from './matriceProblemeVue';
import { Injectable } from '@angular/core';
import * as THREE from 'three';


@Injectable()
export class FiltreCouleurService {
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    private matrice = filtreCouleur;
    private objectColor: any[] = [];
    private objectWithMaterial: any[] = [];

    public initialisation(container: HTMLDivElement) {
        this.container = container;
        this.creerScene();
        this.scene.add(this.camera);
        const axesHelper = new THREE.AxisHelper(5);
        this.scene.add(axesHelper);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const material2 = new THREE.MeshBasicMaterial({ color: 'red' });
        const material3 = new THREE.MeshBasicMaterial({ color: 'blue' });
        const cube = new THREE.Mesh(geometry, material);
        const cube2 = new THREE.Mesh(geometry, material2);
        cube2.position.set(10, 0, 0);
        const cube3 = new THREE.Mesh(geometry, material3);
        cube3.position.set(-10, 0, 0);
        this.scene.add(cube);
        this.scene.add(cube2);
        this.scene.add(cube3);
        this.commencerRendu();
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(30, this.getAspectRatio(), 1, 5000);
        this.camera.position.z = 40;
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

    public recupererObjetAvecMateriel(): void {
        let objet: any;
        for (let i = 0; i < this.scene.children.length; i++) {
            objet = this.scene.children[i];
            if (objet.material) {
                this.objectWithMaterial.push(objet);
            }
        }
    }

    public appliquerFiltreScene(probleme: string): void {
        let couleurNormale = {};
        const filtre = this.recuperFiltre(probleme);
        this.recupererObjetAvecMateriel();
        for (let i = 0; i < this.objectWithMaterial.length; i++) {
            Object.assign(couleurNormale, this.objectWithMaterial[i].material.color);
            this.objectColor.push(couleurNormale);
            this.appliquerFiltreObjetScene(this.objectWithMaterial[i].material.color, filtre);
            couleurNormale = {};
        }
    }

    public appliquerFiltreObjetScene(color: any, filtre: number[]): void {
        color.r = ((color.r * filtre[0]) + (color.g * filtre[1]) + (color.b * filtre[2]) + filtre[4]);
        color.g = ((color.r * filtre[5]) + (color.g * filtre[6]) + (color.b * filtre[7]) + filtre[9]);
        color.b = ((color.r * filtre[10]) + (color.g * filtre[11]) + (color.b * filtre[12]) + filtre[14]);
    }

    public recuperFiltre(probleme: string): number[] {
        for (const filtre in this.matrice) {
            if (this.matrice.hasOwnProperty(filtre) && filtre === probleme) {
                return this.matrice[filtre];
            }
        }
    }

    public enleverFiltre(): void {
        for (let i = 0; i < this.objectWithMaterial.length; i++) {
            this.objectWithMaterial[i].material.color = this.objectColor[i];
        }
        this.objectWithMaterial = [];
        this.objectColor = [];
    }

}


