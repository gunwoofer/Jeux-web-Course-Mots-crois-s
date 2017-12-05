import { CollisionService } from '../voiture/collision.service';
import { GestionnnairePartieService } from './../gestionnairePartie/gestionPartie.service';
import { SkyboxService } from '../skybox/skybox.service';
import { Rendu } from './../jeuDeCourse/renduObject';
import { SortiePisteService } from './../sortiePiste/sortiePiste.service';
import { DeplacementService } from '../deplacement/deplacement.service';
import { GestionnaireDeVue } from '../gestionnaireDeVue/gestionnaireDeVue.service';
import { MondeDuJeuService } from './../mondedujeu/mondedujeu.service';
import { FPS } from './../constant';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from '../voiture/Voiture';


@Injectable()

export class MoteurDeJeuService {

    private renduObject: Rendu;

    constructor(private gestionnnairePartieService: GestionnnairePartieService, private gestionnaireDeVue: GestionnaireDeVue,
        private deplacementService: DeplacementService, private sortiePisteService: SortiePisteService,
        private mondeDuJeuService: MondeDuJeuService, private skyboxService: SkyboxService, private collisionService: CollisionService) {
        this.renduObject = new Rendu();
    }

    public commencerMoteurDeJeu(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera,
        container: HTMLDivElement, scene: THREE.Scene): void {
        renderer = new THREE.WebGLRenderer();
        this.chargerJeu(scene, camera, container);
        this.renduObject.commencerRendu(renderer, container);
        this.moteurDeJeu(renderer, camera, container, scene);
    }

    private chargerJeu(scene: THREE.Scene, camera: THREE.PerspectiveCamera, container: HTMLDivElement): void {
        this.mondeDuJeuService.chargerMonde3D(scene, camera);
        this.gestionnnairePartieService.chargementDesVoitures(scene, container);
    }

    private moteurDeJeu(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera,
        container: HTMLDivElement, scene: THREE.Scene): void {
        setTimeout(() => {
            requestAnimationFrame(() => this.moteurDeJeu(renderer, camera, container, scene));
            this.renduObject.ajusterCadre(renderer, container, camera, scene);
            if (this.gestionnaireDeVue.obtenirEtatRetroviseur()) {
                this.renduObject.ajusterCadre(renderer, this.gestionnnairePartieService.retroviseur,
                    this.gestionnnairePartieService.retroviseur.camera, scene);
            }
            this.miseAJourPositionVoiture(camera);
            this.skyboxService.rotationSkybox(this.gestionnnairePartieService.voitureDuJoueur, camera);
            this.collisionService.gererCollision(this.gestionnnairePartieService.voitureDuJoueur,
                this.gestionnnairePartieService.voituresIA);
        }, 1000 / FPS);
    }

    private miseAJourPositionVoiture(camera: THREE.PerspectiveCamera): void {
        if (this.gestionnnairePartieService.voitureDuJoueur.voiture3D !== undefined) {
            this.gestionnaireDeVue.changementDeVue(camera, this.gestionnnairePartieService.voitureDuJoueur);
            this.gestionnnairePartieService.voituresIA[0].modeAutonome();
            this.deplacementService.moteurDeplacement(this.gestionnnairePartieService.voitureDuJoueur);
            this.sortiePisteService.gererSortiePiste(this.gestionnnairePartieService.voitureDuJoueur,
                this.mondeDuJeuService.segment
                    .chargerSegmentsDePiste(this.mondeDuJeuService.piste));
            this.gererJoueurVirtuel(this.gestionnnairePartieService.voituresIA);
            this.mondeDuJeuService.piste.gererElementDePiste([this.gestionnnairePartieService.voitureDuJoueur]);
            this.gestionnaireDeVue.changementDeVue(camera, this.gestionnnairePartieService.voitureDuJoueur);
        }
    }

    private gererJoueurVirtuel(joueurVirtuel: Voiture[]): void {
        for (let i = 0; i < joueurVirtuel.length; i++) {
            this.gestionnnairePartieService.voituresIA[i].modeAutonome();
            this.mondeDuJeuService.piste.gererElementDePiste([joueurVirtuel[i]]);
            this.sortiePisteService.gererSortiePiste(joueurVirtuel[i], this.mondeDuJeuService.segment
                .chargerSegmentsDePiste(this.mondeDuJeuService.piste));
        }
    }


}
