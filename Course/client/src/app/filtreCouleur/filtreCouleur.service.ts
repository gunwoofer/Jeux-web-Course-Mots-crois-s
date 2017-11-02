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

    public initialisation(container: HTMLDivElement) {
        this.container = container;
        this.creerScene();
        this.scene.add(this.camera);

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);

        this.commencerRendu();
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(30, this.getAspectRatio(), 1, 5000);
        this.camera.position.z = 5;
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

    public appliquerFiltreScene(probleme: string): void {
        // let objet: any;
        // const filtre = this.recuperFiltre(probleme);
        // if (!filtre) { console.log('ce filtre nexiste pas'); return; }
        // for (let i = 0; i < this.scene.children.length; i++) {
        //     objet = this.scene.children[i];
        //     if (objet.material) {
        //         this.appliquerFiltreObjetScene(objet.material.color, filtre);
        //     }
        // }
    }

    public appliquerFiltreObjetScene(color: any, filtre: any[]): void {
        color.r = ((color.r * filtre[0]) + (color.g * filtre[1]) + (color.b * filtre[2]) + filtre[4]);
        color.g = ((color.r * filtre[5]) + (color.g * filtre[6]) + (color.b * filtre[7]) + filtre[9]);
        color.b = ((color.r * filtre[10]) + (color.g * filtre[11]) + (color.b * filtre[12]) + filtre[14]);
    }

    public recuperFiltre(probleme: string): number[] {
        for (const filtre in this.matrice) {
            if (this.matrice.hasOwnProperty(filtre)) {
                if (filtre === probleme) {
                    return this.matrice[filtre];
                }
            }
        }
    }

    public appliquerFiltreDom(probleme: string): void {
    }

}


