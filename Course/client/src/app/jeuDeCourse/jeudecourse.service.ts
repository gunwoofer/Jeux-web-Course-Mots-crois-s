import { MondeDuJeuService } from './../mondedujeu/mondedujeu.service';
import { CollisionService } from './../voiture/collision.service';
import { Rendu } from './renduObject';
import { Retroviseur } from './../gestionnaireDeVue/retroviseur';
import {
    RESULTAT_PARTIE, EMPLACEMENT_VOITURE, DUREE_STINGER_MILISECONDES, FPS, TABLEAU_POSITION, NOMBRE_DE_TOURS_PARTIE_DEFAUT
} from './../constant';
import { PlacementService } from './../objetService/placementVoiture.service';
import { SkyboxService } from './../skybox/skybox.service';
import { SortiePisteService } from './../sortiePiste/sortiePiste.service';
import { GestionnaireDeVue } from './../gestionnaireDeVue/gestionnaireDeVue.service';
import { LumiereService } from '../lumiere/lumiere.service';
import { ObjetService } from '../objetService/objet.service';
import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
import { MusiqueService } from '../musique/musique.service';
import { DeplacementService } from '../deplacement/deplacement.service';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';
import { Partie } from '../partie/Partie';
import { Pilote } from '../partie/Pilote';
import { LigneArrivee } from '../partie/LigneArrivee';
import { Router } from '@angular/router';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { EtatPartie } from '../partie/EtatPartie';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { AffichageTeteHauteService } from '../affichageTeteHaute/affichagetetehaute.service';

@Injectable()
export class JeuDeCourseService implements Observateur {

    public voitureDuJoueur: Voiture;
    public jour = true;
    public phares = false;

    private container: HTMLDivElement;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private renduObject = new Rendu();
    private scene: THREE.Scene;
    private partie: Partie;
    private routeur: Router;
    private voituresIA: Voiture[] = [];
    private nombreTours = NOMBRE_DE_TOURS_PARTIE_DEFAUT;
    private retroviseur: Retroviseur;
    public toutesLesVoitures: Voiture[] = [];

    constructor(private objetService: ObjetService,
                private gestionnaireDeVue: GestionnaireDeVue,
                private musiqueService: MusiqueService,
                private tableauScoreService: TableauScoreService,
                private skyboxService: SkyboxService,
                private placementService: PlacementService,
                private affichageTeteHauteService: AffichageTeteHauteService,
                private sortiePisteService: SortiePisteService,
                public collisionService: CollisionService,
                private deplacementService: DeplacementService,
                private mondeDuJeuService: MondeDuJeuService) {
    }

    public obtenirScene(): THREE.Scene {
        return this.scene;
    }

    public obtenirCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public initialisation(container: HTMLDivElement): void {
        this.container = container;
        this.creerScene();
        this.skyboxService.ajouterSkybox(this.camera);
        this.mondeDuJeuService.chargerMonde3D(this.scene);
        this.chargementDesVoitures();
        LumiereService.ajouterLumierScene(this.scene);
        this.commencerMoteurDeJeu();
    }

    private chargementDesVoitures(): void {
        const nombreAleatoire = Math.round(Math.random() * 3);
        this.chargerVoiture(TABLEAU_POSITION[nombreAleatoire][0], TABLEAU_POSITION[nombreAleatoire][1], true);
        TABLEAU_POSITION.splice(nombreAleatoire, 1);
        for (let i = 0; i < TABLEAU_POSITION.length; i++) {
            this.chargerVoiture(TABLEAU_POSITION[i][0], TABLEAU_POSITION[i][1], false);
        }
    }

    public chargerVoiture(cadranX: number, cadranY: number, joueur: boolean): void {
        this.placementService.calculPositionCentreZoneDepart(this.mondeDuJeuService.segment.premierSegment);
        this.placementService.obtenirVecteursSensPiste(this.mondeDuJeuService.segment.premierSegment);
        const loader = new THREE.ObjectLoader();
        loader.load(EMPLACEMENT_VOITURE, (obj) => {
            this.objetService.manipulationObjetVoiture(this.mondeDuJeuService.segment.premierSegment[1],
                                                        this.mondeDuJeuService.segment.premierSegment[0], obj);
            this.configurationVoiturePiste(cadranX, cadranY, obj, joueur);
            this.scene.add(obj);
        });
    }

    public chargementVoituresPourCollision() {
        for (let i = 0 ; i < this.voituresIA.length; i++) {
            this.toutesLesVoitures.push(this.voituresIA[i]);
        }
        this.toutesLesVoitures.push(this.voitureDuJoueur);
    }

    public configurationVoiturePiste(cadranX: number, cadranY: number, obj: THREE.Object3D, joueur: boolean): void {
        let meshPrincipalVoiture: any;
        meshPrincipalVoiture = obj.getObjectByName('MainBody');
        if (joueur) {
            meshPrincipalVoiture.material.color.set('grey');
            this.voitureDuJoueur = new Voiture(obj, this.mondeDuJeuService.piste);
            this.calculePositionVoiture(cadranX, cadranY, this.voitureDuJoueur);
            this.retroviseur = new Retroviseur(this.container, this.voitureDuJoueur);
            this.preparerPartie();
            this.partie.demarrerPartie();
        } else {
            meshPrincipalVoiture.material.color.set('black');
            this.voituresIA.push(new Voiture(obj, this.mondeDuJeuService.piste));
            this.voituresIA[this.voituresIA.length - 1].ajouterIndicateursVoitureScene(this.scene);
            this.calculePositionVoiture(cadranX, cadranY, this.voituresIA[this.voituresIA.length - 1]);
        }
    }

    private preparerPartie(): void {
        const pilote: Pilote = new Pilote(this.voitureDuJoueur, true);
        const ligneArrivee: LigneArrivee = new LigneArrivee(this.mondeDuJeuService.segment.premierSegment[1],
            this.mondeDuJeuService.segment.premierSegment[3], this.mondeDuJeuService.segment.damierDeDepart);
        const pilotes: Pilote[] = [pilote];
        this.partie = new Partie(pilotes, ligneArrivee, this.nombreTours,
            [this.musiqueService.musique, this], [this.affichageTeteHauteService]);
        this.affichageTeteHauteService.mettreAJourAffichage(pilotes.length, this.nombreTours);
    }

    private creerScene(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 6000);
        this.scene.add(this.camera);
    }

    private commencerMoteurDeJeu(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renduObject.commencerRendu(this.renderer, this.container);
        this.moteurDeJeu();
    }

    private moteurDeJeu(): void {
        setTimeout(() => {
            requestAnimationFrame(() => this.moteurDeJeu());
            this.renduObject.ajusterCadre(this.renderer, this.container, this.camera, this.scene);
            if (this.gestionnaireDeVue.obtenirEtatRetroviseur()) {
                this.renduObject.ajusterCadre(this.renderer, this.retroviseur, this.retroviseur.camera, this.scene);
            }
            this.miseAJourPositionVoiture();
            this.skyboxService.rotationSkybox(this.voitureDuJoueur, this.camera);
            if (this.toutesLesVoitures.length < 2) {
                this.chargementVoituresPourCollision();
            }
            this.collisionService.analyserCollision(this.toutesLesVoitures);
        }, 1000 / FPS);
    }

    private miseAJourPositionVoiture(): void {
        if (this.voitureDuJoueur.voiture3D !== undefined) {
            this.gestionnaireDeVue.changementDeVue(this.camera, this.voitureDuJoueur);
            this.voituresIA[0].modeAutonome();
            this.deplacementService.moteurDeplacement(this.voitureDuJoueur);
            this.renderMiseAJour();
        }
    }

    private renderMiseAJour(): void {
        if (this.voitureDuJoueur !== undefined) {
            this.sortiePisteService.gererSortiePiste(this.voitureDuJoueur,
                                                    this.mondeDuJeuService.segment
                                                        .chargerSegmentsDePiste(this.mondeDuJeuService.piste));
            this.mondeDuJeuService.piste.gererElementDePiste([this.voitureDuJoueur]);
            this.gestionnaireDeVue.changementDeVue(this.camera, this.voitureDuJoueur);
        }
    }

    public calculePositionVoiture(cadranX: number, cadranY: number, voiture: Voiture) {
        voiture.voiture3D.position.set(
            this.placementService.calculPositionVoiture(cadranX, cadranY, this.mondeDuJeuService.segment.premierSegment).x,
            this.placementService.calculPositionVoiture(cadranX, cadranY, this.mondeDuJeuService.segment.premierSegment).y, 0);
    }

    public configurerTours(nombreTours: number): void {
        this.nombreTours = nombreTours;
        Partie.toursAComplete = this.nombreTours;
    }

    public ajouterRouter(routeur: Router): void {
        this.routeur = routeur;
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    private getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    public logiquePhares(): void {
        if (!this.phares && this.jour) {
            this.phares = !this.phares;
            LumiereService.alternerPhares(this.voitureDuJoueur);
        } else if (this.phares && !this.jour) {
            this.phares = !this.phares;
            LumiereService.alternerPhares(this.voitureDuJoueur);
        }
    }

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (type === NotificationType.Non_definie) {
            if (this.partie.etatPartie === EtatPartie.Termine) {
                setTimeout(() => {
                    this.voirPageFinPartie();
                }, DUREE_STINGER_MILISECONDES);
            }
        }
    }

    private voirPageFinPartie(): void {
        this.tableauScoreService.temps = (Pilote.tempsTotal / 1000);
        this.tableauScoreService.finPartie = true;
        this.routeur.navigateByUrl(RESULTAT_PARTIE);
    }
}
