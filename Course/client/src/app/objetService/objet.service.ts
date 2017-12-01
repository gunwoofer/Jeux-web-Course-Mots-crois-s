import { LumiereService } from '../lumiere/lumiere.service';
import {
    LUMIERES, ARBRE_PATH, ARBRE_TEXTURE, WIDTH,
    NOM_ARBRE, NOMBRE_ARBRE_CREE, NOMS_OBJET_A_ENLEVER,
    LUMIERE_AVANT_DROITE, LUMIERE_AVANT_GAUCHE, PHARE_GAUCHE, PHARE_DROITE, NOM_VOITURE
} from './../constant';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Object3D } from 'three';

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
        loader.load(path, (obj: Object3D) => {
            let arbre: any; let instance: any;
            arbre = obj.getObjectByName(NOM_ARBRE);
            arbre.material.map = new THREE.TextureLoader().load(texture);
            for (let i = 0; i < NOMBRE_ARBRE_CREE; i++) {
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
        for (let nom = 0; nom < NOMS_OBJET_A_ENLEVER.length; nom++) {
            object.remove(object.getObjectByName(NOMS_OBJET_A_ENLEVER[nom]));
        }
    }

    public eteindreTousLesPhares(objet: THREE.Object3D): void {
        for (let lumiere = 0; lumiere < LUMIERES.length; lumiere++) {
            objet.getObjectByName(LUMIERES[lumiere]).visible = false;
        }
    }

    public ajouterPhares(objet: THREE.Object3D): void {
        const lumiereDroite = this.lumiereService.creerLumiereAvant(LUMIERE_AVANT_DROITE, 1);
        objet.add(lumiereDroite);
        objet.add(lumiereDroite.target);
        const lumiereGauche = this.lumiereService.creerLumiereAvant(LUMIERE_AVANT_GAUCHE, -1);
        objet.add(lumiereGauche);
        objet.add(lumiereGauche.target);
        objet.add(this.lumiereService.creerPhare(PHARE_DROITE, 1));
        objet.add(this.lumiereService.creerPhare(PHARE_GAUCHE, -1));
    }

    public vecteurAngle(vecteur: THREE.Vector3, vecteur2: THREE.Vector3): THREE.Vector2 {
        return new THREE.Vector2((vecteur.x - vecteur2.x), (vecteur.y - vecteur2.y));
    }

    public manipulationObjetVoiture(vecteur: THREE.Vector3, vecteur2: THREE.Vector3, objet: THREE.Object3D): void {
        const vecteurCalculAngle = this.vecteurAngle(vecteur, vecteur2);
        objet.rotateX(Math.PI / 2);
        objet.rotateY(vecteurCalculAngle.angle());
        objet.name = NOM_VOITURE;
        this.enleverObjet(objet);
        this.ajouterPhares(objet);
        this.eteindreTousLesPhares(objet);
        objet.receiveShadow = true;
    }

}
