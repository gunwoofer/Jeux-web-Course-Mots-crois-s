import { Injectable } from '@angular/core';
import * as THREE from 'three';


@Injectable()
export class ObjetRandomService {

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
        let arbre: any; let lumieres: any; let instance: any;
        const textur = new THREE.TextureLoader().load(texture);
        loader.load(path, (obj) => {
            arbre = obj.children[1];
            lumieres = obj.children[0];
            arbre.material.map = textur;
            groupe.add(lumieres);
            for (let i = 0; i < 10; i++) {
                instance = arbre.clone();
                this.genereRandomPosition(instance.position, chiffre);
                groupe.add(instance);
            }
        });
        groupe.rotateX(Math.PI / 2);
        return groupe;
    }
}



