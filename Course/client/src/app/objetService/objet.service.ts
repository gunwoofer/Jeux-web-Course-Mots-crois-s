import { LumiereService } from '../lumiere/lumiere.service';
import { LUMIERES, ARBRE_PATH, ARBRE_TEXTURE, WIDTH } from './../constant';
import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class ObjetService {

    private objetArbre: THREE.Object3D;

    constructor(private lumiereService: LumiereService) {
        this.objetArbre = this.chargerArbre(ARBRE_PATH, ARBRE_TEXTURE, WIDTH);
    }

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

    public ajouterArbreScene(scene: THREE.Scene): void {
        scene.add(this.objetArbre);
    }

    public enleverObjet(object: THREE.Object3D): void {
        const noms = ['Plane', 'Null'];
        for (let i = 0; i < noms.length; i++) {
            object.remove(object.getObjectByName(noms[i]));
        }
    }

    public eteindreTousLesPhares(objet: THREE.Object3D): void {
        for (let i = 0; i < LUMIERES.length; i++) {
            objet.getObjectByName(LUMIERES[i]).visible = false;
        }
    }

    public ajouterPhares(objet: THREE.Object3D): void {
        const lumiereDroite = this.lumiereService.creerLumiereAvant('Lumière Avant Droite', 1);
        objet.add(lumiereDroite);
        objet.add(lumiereDroite.target);
        const lumiereGauche = this.lumiereService.creerLumiereAvant('Lumière Avant Gauche', -1);
        objet.add(lumiereGauche);
        objet.add(lumiereGauche.target);
        objet.add(this.lumiereService.creerPhare('Phare Droit', 1));
        objet.add(this.lumiereService.creerPhare('Phare Gauche', -1));
    }

    public vecteurAngle(vecteur: THREE.Vector3, vecteur2: THREE.Vector3): THREE.Vector2 {
        return new THREE.Vector2((vecteur.x - vecteur2.x), (vecteur.y - vecteur2.y));
    }

    public manipulationObjetVoiture(vecteur: THREE.Vector3, vecteur2: THREE.Vector3, objet: THREE.Object3D): void {
        const vecteurCalculAngle = this.vecteurAngle(vecteur, vecteur2);
        objet.rotateX(Math.PI / 2);
        objet.rotateY(vecteurCalculAngle.angle());
        objet.name = 'Voiture';
        this.enleverObjet(objet);
        this.ajouterPhares(objet);
        this.eteindreTousLesPhares(objet);
        objet.receiveShadow = true;
    }

}
