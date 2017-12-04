import { Voiture } from '../voiture/Voiture';
import { LumiereService } from './../lumiere/lumiere.service';
import { FonctionMaths } from './../fonctionMathematiques';
import {
    LUMIERES, ARBRE_PATH, ARBRE_TEXTURE, WIDTH,
    NOM_ARBRE, NOMBRE_ARBRE_CREE, NOMS_OBJET_A_ENLEVER,
    LUMIERE_AVANT_DROITE, LUMIERE_AVANT_GAUCHE, PHARE_GAUCHE, PHARE_DROITE, NOM_VOITURE
} from './../constant';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Object3D } from 'three';
import { PlacementService } from './placementVoiture.service';
import { Segment } from '../piste/segment.model';

export const MESH_PRINCIPAL_NOM = 'MainBody';

@Injectable()
export class ObjetService {


    public static ajouterArbreScene(scene: THREE.Scene): void {
        scene.add(this.chargerArbre(ARBRE_PATH, ARBRE_TEXTURE, WIDTH));
    }

    public static chargerArbre(path: string, texture: string, chiffre: number): THREE.Object3D {
        const loader = new THREE.ObjectLoader();
        const groupe = new THREE.Object3D();
        loader.load(path, (obj: Object3D) => {
            let arbre: any; let instance: any;
            arbre = obj.getObjectByName(NOM_ARBRE);
            arbre.material.map = new THREE.TextureLoader().load(texture);

            for (let i = 0; i < NOMBRE_ARBRE_CREE; i++) {
                instance = arbre.clone();
                FonctionMaths.genererPositionAleatoire(instance.position, chiffre);
                groupe.add(instance);
            }
        });
        groupe.rotateX(Math.PI / 2);
        return groupe;
    }

    public static manipulationObjetVoiture(segment: Segment, objet: THREE.Object3D, couleur: String): void {
        const meshPrincipalVoiture = <any>objet.getObjectByName(MESH_PRINCIPAL_NOM);
        meshPrincipalVoiture.material.color.set(couleur);
        objet.rotateX(Math.PI / 2);
        objet.rotateY(this.vecteurAngle(segment.premierSegment[1], segment.premierSegment[0]).angle());
        objet.name = NOM_VOITURE;
        this.enleverObjet(objet);
        LumiereService.ajouterPhares(objet);
        LumiereService.eteindreTousLesPhares(objet);
        objet.receiveShadow = true;
    }

    public static enleverObjet(object: THREE.Object3D): void {
        for (let nom = 0; nom < NOMS_OBJET_A_ENLEVER.length; nom++) {
            object.remove(object.getObjectByName(NOMS_OBJET_A_ENLEVER[nom]));
        }
    }

    public static vecteurAngle(vecteur: THREE.Vector3, vecteur2: THREE.Vector3): THREE.Vector2 {
        return new THREE.Vector2((vecteur.x - vecteur2.x), (vecteur.y - vecteur2.y));
    }

    public static calculePositionObjetVoiture(cadranX: number, cadranY: number, voiture: Voiture, segment: Segment) {
        voiture.voiture3D.position.set(
            PlacementService.calculPositionVoiture(cadranX, cadranY, segment.premierSegment).x,
            PlacementService.calculPositionVoiture(cadranX, cadranY, segment.premierSegment).y, 0);
    }

}
