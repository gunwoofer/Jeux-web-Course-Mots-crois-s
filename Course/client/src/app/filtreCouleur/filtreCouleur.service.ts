import { filtreCouleur, nomFiltre } from './matriceProblemeVue';
import { Injectable } from '@angular/core';
import * as THREE from 'three';


@Injectable()
export class FiltreCouleurService {
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public plane: THREE.Mesh;
    public scene: THREE.Scene;
    private matrice = filtreCouleur;
    private objectColor: any[] = [];
    private objectWithMaterial: any[] = [];
    private taille = nomFiltre.length - 1;
    private min = 0;
    private filtreApplique = true;


    public recupererObjetsAvecMateriel(scene: THREE.Scene): void {
        let objet: any;
        for (let i = 0; i < scene.children.length; i++) {
            objet = scene.children[i];
            if (objet.material) {
                this.objectWithMaterial.push(objet);
            }
        }
    }

    public appliquerFiltreScene(scene: THREE.Scene): void {
        let couleurNormale = {};
        const filtre = this.recupererMatriceFiltre();
        this.recupererObjetsAvecMateriel(scene);
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

    public randomFiltre(): string {
        const indice = Math.floor(Math.random() * (this.taille - 0 + 1) + 0);
        return nomFiltre[indice];
    }

    public recupererMatriceFiltre(): number[] {
        const probleme = this.randomFiltre();
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

    public mettreFiltre(event, scene: THREE.Scene): void {
        this.filtreApplique = !this.filtreApplique;
        if (!this.filtreApplique) {
            console.log('filtre applique');
            this.appliquerFiltreScene(scene);
        } else if (this.filtreApplique) {
            console.log('filtre enleve');
            this.enleverFiltre();
        }
    }

}


