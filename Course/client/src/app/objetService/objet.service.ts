import { Injectable } from '@angular/core';
import * as THREE from 'three';

export const LUMIERES = [
    'AreaLight', 'AreaLight1', 'SpotLight', 'SpotLight1', 'HemisphereLight',
    'BrakeLightLS1', 'BrakeLightLS2', 'BrakeLightLS3', 'BrakeLightLS4',
    'BrakeLightRS1', 'BrakeLightRS2', 'BrakeLightRS3', 'BrakeLightRS4',
    'Lumière Avant Droite', 'Lumière Avant Gauche', 'Phare Droit', 'Phare Gauche'];

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

    public eteindreTousLesPhares(objet: THREE.Object3D): void {
        for (let i = 0; i < LUMIERES.length; i++) {
            objet.getObjectByName(LUMIERES[i]).visible = false;
        }
    }

    public ajouterPhares(objet: THREE.Object3D): void {
        const lumiereDroite = this.creerLumiereAvant('Lumière Avant Droite', 1);
        objet.add(lumiereDroite);
        objet.add(lumiereDroite.target);
        const lumiereGauche = this.creerLumiereAvant('Lumière Avant Gauche', -1);
        objet.add(lumiereGauche);
        objet.add(lumiereGauche.target);

        objet.add(this.creerPhare('Phare Droit', 1));
        objet.add(this.creerPhare('Phare Gauche', -1));
    }

    public creerPhare(nom: string, cote: number): THREE.PointLight {
        const phare = new THREE.PointLight(0xffffff, 0.5, 5);
        phare.name = nom;
        phare.position.set(2.7, 1, cote * 0.6);
        phare.rotation.set(Math.PI, Math.PI, -Math.PI);
        return phare;
    }

    public creerLumiereAvant(nom: string, cote: number) {
        const lumiereAvant = new THREE.SpotLight(0xffffff, 2);
        lumiereAvant.name = nom;
        lumiereAvant.position.set(3, 1.5, cote * 0.6);
        lumiereAvant.angle = 0.5;
        lumiereAvant.target.position.set(6, 0.5, cote * 1);
        lumiereAvant.distance = 80;
        return lumiereAvant;
    }

}
