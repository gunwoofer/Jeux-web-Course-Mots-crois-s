import { FonctionMaths } from './../fonctionMathematiques';
import { VITESSE_MIN, ROTATION, SKYBOX_JOUR, SKYBOX_NUIT, NOM_SKYBOX } from './../constant';
import { Skybox } from './skybox.model';
import { Voiture } from './../voiture/Voiture';
import { DeplacementService } from './../deplacement/deplacement.service';
import * as THREE from 'three';
import { Injectable } from '@angular/core';

@Injectable()
export class SkyboxService {

    private listeSkyboxJour: THREE.Mesh[];
    private listeSkyboxNuit: THREE.Mesh[];


    constructor(private deplacementService: DeplacementService) {
        this.listeSkyboxJour = new Array<THREE.Mesh>();
        this.listeSkyboxNuit = new Array<THREE.Mesh>();
        this.chargerLesSkybox();
    }

    public rotationSkybox(voitureDuJoueur: Voiture, camera: THREE.PerspectiveCamera): void {
        if (this.deplacementService.aDroite && voitureDuJoueur.vitesse > VITESSE_MIN) {
            camera.getObjectByName(NOM_SKYBOX).rotateY(ROTATION);
        }
        if (this.deplacementService.aGauche && voitureDuJoueur.vitesse > VITESSE_MIN) {
            camera.getObjectByName(NOM_SKYBOX).rotateY(-ROTATION);
        }
    }

    public ajouterSkybox(camera: THREE.PerspectiveCamera): void {
        camera.add(this.listeSkyboxJour[FonctionMaths.emplacementAleatoireSkyBox(this.listeSkyboxJour.length)]);
    }

    public chargerLesSkybox(): void {
        this.genererToutesLesSkyboxJour();
        this.genererToutesLesSkyboxNuit();
    }

    private genererToutesLesSkyboxJour(): void {
        for (let i = 0; i < SKYBOX_JOUR.length; i++) {
            this.listeSkyboxJour.push(Skybox.creerSkybox(SKYBOX_JOUR[i]));
        }
    }

    private genererToutesLesSkyboxNuit(): void {
        for (let i = 0; i < SKYBOX_NUIT.length; i++) {
            this.listeSkyboxNuit.push(Skybox.creerSkybox(SKYBOX_NUIT[i]));
        }
    }

    public alternerSkybox(jour: boolean, camera: THREE.PerspectiveCamera): void {
        if (!jour) {
            this.changerSkybox(camera, this.listeSkyboxNuit);
        } else {
            this.changerSkybox(camera, this.listeSkyboxJour);
        }
    }

    private changerSkybox(camera: THREE.PerspectiveCamera, listeSkybox: Array<THREE.Mesh>): void {
        camera.remove(camera.getObjectByName(NOM_SKYBOX));
        camera.add(listeSkybox[FonctionMaths.emplacementAleatoireSkyBox(listeSkybox.length)]);
    }
}
