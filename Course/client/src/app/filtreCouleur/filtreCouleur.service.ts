import { filtreCouleur, nomFiltre } from './matriceProblemeVue';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

const min = 0;

@Injectable()
export class FiltreCouleurService {
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public plane: THREE.Mesh;
    public scene: THREE.Scene;

    private matrice = filtreCouleur;
    private objectColor: any[] = new Array();
    private objectWithMaterial: any[] = new Array();
    private taille = nomFiltre.length - 1;
    private filtreApplique = true;


    public appliquerFiltreScene(scene: THREE.Scene): void {
        const filtre = this.recupererMatriceFiltre();
        this.recupererObjetsAvecMateriel(scene);
        let couleurNormale = {};

        for (const objetMateriel of this.objectWithMaterial) {
            Object.assign(couleurNormale, objetMateriel.material.color);
            this.objectColor.push(couleurNormale);
            this.appliquerFiltreObjetScene(objetMateriel.material.color, filtre);
            couleurNormale = {};
        }
    }

    public mettreFiltre(event, scene: THREE.Scene): void {
        this.filtreApplique = !this.filtreApplique;

        if (!this.filtreApplique) {
            this.appliquerFiltreScene(scene);
        } else {
            this.enleverFiltre();
        }
    }

    private recupererObjetsAvecMateriel(scene: THREE.Scene): void {
        for (const enfant of scene.children) {
            const objet: any = enfant;
            if (objet.material) {
                this.objectWithMaterial.push(objet);
            }
        }
    }


    private appliquerFiltreObjetScene(color: any, filtre: number[]): void {
        color.r = ((color.r * filtre[0]) + (color.g * filtre[1]) + (color.b * filtre[2]) + filtre[4]);
        color.g = ((color.r * filtre[5]) + (color.g * filtre[6]) + (color.b * filtre[7]) + filtre[9]);
        color.b = ((color.r * filtre[10]) + (color.g * filtre[11]) + (color.b * filtre[12]) + filtre[14]);
    }

    private randomFiltre(): string {
        const indice = Math.floor(Math.random() * (this.taille - min + 1) + min);
        return nomFiltre[indice];
    }

    private recupererMatriceFiltre(): number[] {
        const filtreAleatoire = this.randomFiltre();

        for (const filtre in this.matrice) {
            if (this.matrice.hasOwnProperty(filtre) && filtre === filtreAleatoire) {
                return this.matrice[filtre];
            }
        }
    }

    private enleverFiltre(): void {
        for (let i = 0; i < this.objectWithMaterial.length; i++) {
            this.objectWithMaterial[i].material.color = this.objectColor[i];
        }

        this.objectWithMaterial = new Array();
        this.objectColor = new Array();
    }
}


