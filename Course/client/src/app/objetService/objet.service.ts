import { Injectable } from '@angular/core';
import * as THREE from 'three';


@Injectable()
export class ObjetService {

    public random(min, max): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public genereRandomPosition(vecteur: THREE.Vector3, chiffre: number): void {
        vecteur.x = this.random(-chiffre / 10, chiffre / 10);
        vecteur.z = this.random(-chiffre / 10, chiffre / 10);
        vecteur.y = 0;
    }

    public chargerArbre(path: string, texture: string, chiffre: number): THREE.Object3D {
        const loader = new THREE.ObjectLoader();
        const groupe = new THREE.Object3D();
        loader.load(path, (obj) => {
            let arbre: any; let instance: any;
            arbre = obj.getObjectByName('Prunus_americana_01');
            arbre.material.map = new THREE.TextureLoader().load(texture);
            for (let i = 0; i < 10; i++) {
                instance = arbre.clone();
                this.genereRandomPosition(instance.position, chiffre);
                groupe.add(instance);
            }
        });
        groupe.rotateX(Math.PI / 2);
        return groupe;
    }

    public enleverObjet(object: THREE.Object3D): void {
        const noms = ['Plane', 'Null'];
        for (let i = 0; i < noms.length; i++) {
            object.remove(object.getObjectByName(noms[i]));
        }
    }

    public gererPhares(objet: THREE.Object3D): void {
        const noms = [
        'AreaLight', 'AreaLight1', 'SpotLight', 'SpotLight1', 'HemisphereLight',
        'BrakeLightLS1', 'BrakeLightLS2', 'BrakeLightLS3', 'BrakeLightLS4',
        'BrakeLightRS1', 'BrakeLightRS2', 'BrakeLightRS3', 'BrakeLightRS4'];
        for (let i = 0; i < noms.length; i++) {
            objet.getObjectByName(noms[i]).visible = false;
        }
        /*for (let i = 5; i < 9; i++) {
            objet.getObjectByName(noms[i]).visible = true;
        }*/
        // objet.getObjectByName('BrakeLightLS1').visible = true;
        // objet.getObjectByName('BrakeLightRS1').visible = true;
        console.log(objet);
    }
}



