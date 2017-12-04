import { SkyboxService } from '../skybox/skybox.service';
import { Rendu } from './../jeuDeCourse/renduObject';
import { SortiePisteService } from './../sortiePiste/sortiePiste.service';
import { DeplacementService } from '../deplacement/deplacement.service';
import { GestionnaireDeVue } from '../gestionnaireDeVue/gestionnaireDeVue.service';
import { GestionPartieService } from './../voiture/gestionPartie.service';
import { MondeDuJeuService } from './../mondedujeu/mondedujeu.service';
import { FPS } from './../constant';
import { Injectable } from '@angular/core';
import * as THREE from 'three';


@Injectable()

export class MoteurDeJeuService {

    private renduObject: Rendu;

    constructor(private gestionPartieService: GestionPartieService, private gestionnaireDeVue: GestionnaireDeVue,
        private deplacementService: DeplacementService, private sortiePisteService: SortiePisteService,
        private mondeDuJeuService: MondeDuJeuService, private skyboxService: SkyboxService) {
        this.renduObject = new Rendu();
    }

    public chargerJeu(scene: THREE.Scene, camera: THREE.PerspectiveCamera, container: HTMLDivElement): void {
        this.mondeDuJeuService.chargerMonde3D(scene, camera);
        this.gestionPartieService.chargementDesVoitures(scene, container);
    }

    public moteurDeJeu(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera,
        container: HTMLDivElement, scene: THREE.Scene): void {
        setTimeout(() => {
            requestAnimationFrame(() => this.moteurDeJeu(renderer, camera, container, scene));
            this.renduObject.ajusterCadre(renderer, container, camera, scene);
            if (this.gestionnaireDeVue.obtenirEtatRetroviseur()) {
                this.renduObject.ajusterCadre(renderer, this.gestionPartieService.retroviseur,
                    this.gestionPartieService.retroviseur.camera, scene);
            }
            this.miseAJourPositionVoiture(camera);
            this.skyboxService.rotationSkybox(this.gestionPartieService.voitureDuJoueur, camera);
        }, 1000 / FPS);
    }

    private miseAJourPositionVoiture(camera: THREE.PerspectiveCamera): void {
        if (this.gestionPartieService.voitureDuJoueur.voiture3D !== undefined) {
            this.gestionnaireDeVue.changementDeVue(camera, this.gestionPartieService.voitureDuJoueur);
            this.gestionPartieService.voituresIA[0].modeAutonome();
            this.deplacementService.moteurDeplacement(this.gestionPartieService.voitureDuJoueur);
            this.sortiePisteService.gererSortiePiste(this.gestionPartieService.voitureDuJoueur,
                this.mondeDuJeuService.segment
                    .chargerSegmentsDePiste(this.mondeDuJeuService.piste));
            this.mondeDuJeuService.piste.gererElementDePiste([this.gestionPartieService.voitureDuJoueur]);
            this.gestionnaireDeVue.changementDeVue(camera, this.gestionPartieService.voitureDuJoueur);
        }
    }
}
