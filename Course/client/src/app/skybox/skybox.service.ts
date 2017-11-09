import { skyBoxJour, skyBoxNuit } from './listeSkybox';
import { Skybox } from './skybox.model';
import { Voiture } from './../voiture/Voiture';
import { Deplacement, vitesseMin, rotation } from './../generateurPiste/deplacement';
import * as THREE from 'three';
import { Injectable } from '@angular/core';

@Injectable()
export class SkyboxService {
    private skybox: Skybox;

    constructor () { this.skybox = new Skybox(); }

    public rotationSkybox(deplacement: Deplacement, voitureDuJoueur: Voiture, camera: THREE.PerspectiveCamera): void {
        if (deplacement.aDroite && voitureDuJoueur.vitesse > vitesseMin) {
            camera.getObjectByName('Skybox').rotateY(rotation);
        }
        if (deplacement.aGauche && voitureDuJoueur.vitesse > vitesseMin) {
            camera.getObjectByName('Skybox').rotateY(-rotation);
        }
    }

    public chargerLesSkybox(listeSkyboxJour: Array<THREE.Mesh>, listeSkyboxNuit: Array<THREE.Mesh>): void {
        this.genererToutesLesSkyboxJour(listeSkyboxJour);
        this.genererToutesLesSkyboxNuit(listeSkyboxNuit);
    }

    private genererToutesLesSkyboxJour(listeSkyboxJour: Array<THREE.Mesh>): void {
        for (let i = 0; i < skyBoxJour.length; i++) {
            listeSkyboxJour.push(this.skybox.creerSkybox(skyBoxJour[i]));
        }
    }

    private genererToutesLesSkyboxNuit(listeSkyboxNuit: Array<THREE.Mesh>): void {
        for (let i = 0; i < skyBoxNuit.length; i++) {
            listeSkyboxNuit.push(this.skybox.creerSkybox(skyBoxNuit[i]));
        }
    }

    public ajouterSkybox(camera: THREE.PerspectiveCamera, listeSkybox: Array<THREE.Mesh>): void {
        camera.add(listeSkybox[this.skybox.emplacementAleatoire(listeSkybox.length)]);
    }

    public changerSkybox(camera: THREE.PerspectiveCamera, listeSkybox: Array<THREE.Mesh>): void {
        camera.remove(camera.getObjectByName('Skybox'));
        camera.add(listeSkybox[this.skybox.emplacementAleatoire(listeSkybox.length)]);
    }
}
