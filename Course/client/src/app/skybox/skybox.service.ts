import { VITESSE_MIN, ROTATION, SKYBOX_JOUR, SKYBOX_NUIT, NOM_SKYBOX } from './../constant';
import { Skybox } from './skybox.model';
import { Voiture } from './../voiture/Voiture';
import { DeplacementService } from './../generateurPiste/deplacement.service';
import * as THREE from 'three';
import { Injectable } from '@angular/core';

@Injectable()
export class SkyboxService {
    private skybox: Skybox;
    private deplacementService: DeplacementService;

    constructor() {
        this.skybox = new Skybox();
        this.deplacementService = new DeplacementService();
    }

    public rotationSkybox(voitureDuJoueur: Voiture, camera: THREE.PerspectiveCamera): void {
        if (this.deplacementService.aDroite && voitureDuJoueur.vitesse > VITESSE_MIN) {
            camera.getObjectByName(NOM_SKYBOX).rotateY(ROTATION);
        }
        if (this.deplacementService.aGauche && voitureDuJoueur.vitesse > VITESSE_MIN) {
            camera.getObjectByName(NOM_SKYBOX).rotateY(-ROTATION);
        }
    }

    public chargerLesSkybox(listeSkyboxJour: Array<THREE.Mesh>, listeSkyboxNuit: Array<THREE.Mesh>): void {
        this.genererToutesLesSkyboxJour(listeSkyboxJour);
        this.genererToutesLesSkyboxNuit(listeSkyboxNuit);
    }

    private genererToutesLesSkyboxJour(listeSkyboxJour: Array<THREE.Mesh>): void {
        for (let i = 0; i < SKYBOX_JOUR.length; i++) {
            listeSkyboxJour.push(this.skybox.creerSkybox(SKYBOX_JOUR[i]));
        }
    }

    private genererToutesLesSkyboxNuit(listeSkyboxNuit: Array<THREE.Mesh>): void {
        for (let i = 0; i < SKYBOX_NUIT.length; i++) {
            listeSkyboxNuit.push(this.skybox.creerSkybox(SKYBOX_NUIT[i]));
        }
    }

    public ajouterSkybox(camera: THREE.PerspectiveCamera, listeSkybox: Array<THREE.Mesh>): void {
        camera.add(listeSkybox[this.skybox.emplacementAleatoire(listeSkybox.length)]);
    }

    public changerSkybox(camera: THREE.PerspectiveCamera, listeSkybox: Array<THREE.Mesh>): void {
        camera.remove(camera.getObjectByName('Skybox'));
        camera.add(listeSkybox[this.skybox.emplacementAleatoire(listeSkybox.length)]);
    }

    public alternerSkybox(jour: boolean, camera: THREE.PerspectiveCamera,
        listeSkyboxJour: Array<THREE.Mesh>, listeSkyboxNuit: Array<THREE.Mesh>): void {
        if (!jour) {
            this.changerSkybox(camera, listeSkyboxNuit);
        } else {
            this.changerSkybox(camera, listeSkyboxJour);
        }
    }
}
