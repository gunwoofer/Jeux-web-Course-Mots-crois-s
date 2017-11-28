import { PointDeControle } from './../piste/pointDeControle.model';
import {
    FIN_PARTIE_URL, EMPLACEMENT_VOITURE, DUREE_STINGER_MILISECONDES, FPS, TABLEAU_POSITION,
    LONGUEUR_SURFACE_HORS_PISTE, LARGEUR_SURFACE_HORS_PISTE, NOMBRE_DE_TOURS_PAR_DEFAULT
} from './../constant';

import { PlacementService } from './../objetService/placementVoiture.service';
import { SkyboxService } from './../skybox/skybox.service';
import { SortiePisteService } from './../sortiePiste/sortiePiste.service';
import { Segment } from './../piste/segment.model';
import { SurfaceHorsPiste } from './../surfaceHorsPiste/surfaceHorsPiste.service';
import { CameraService } from '../cameraService/cameraService.service';
import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
import { LumiereService } from '../lumiere/lumiere.service';
import { ObjetService } from '../objetService/objet.service';
import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
import { MusiqueService } from '../musique/musique.service';

import { Deplacement } from './deplacement.model';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';

import { Piste } from '../piste/piste.model';
import { Partie } from '../partie/Partie';
import { Pilote } from '../partie/Pilote';
import { LigneArrivee } from '../partie/LigneArrivee';
import { Router } from '@angular/router';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { EtatPartie } from '../partie/EtatPartie';
import { Sujet } from '../../../../commun/observateur/Sujet';
import { NotificationType } from '../../../../commun/observateur/NotificationType';
import { AffichageTeteHauteService } from '../affichageTeteHaute/affichagetetehaute.service';
import { AxisHelper } from 'three';


@Injectable()
export class GenerateurPisteService implements Observateur {

    public container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    public voitureDuJoueur: Voiture;
    public deplacement = new Deplacement();
    public jour = true;
    public phares = false;
    public sortiePisteService: SortiePisteService;
    public piste: Piste;
    public surfaceHorsPisteService: SurfaceHorsPiste;
    public partie: Partie;
    public routeur: Router;
    public segment: Segment;
    public pointeDeControle = new PointDeControle();
    public voituresIA: Voiture[] = [];
    public listeSkyboxJour: Array<THREE.Mesh>;
    public listeSkyboxNuit: Array<THREE.Mesh>;
    public nombreTours = NOMBRE_DE_TOURS_PAR_DEFAULT;
    public idGlobale: number;

    constructor(public objetService: ObjetService, public lumiereService: LumiereService,
        public filtreCouleurService: FiltreCouleurService, public cameraService: CameraService,
        public musiqueService: MusiqueService, public tableauScoreService: TableauScoreService,
        public skyboxService: SkyboxService, public placementService: PlacementService,
        public affichageTeteHauteService: AffichageTeteHauteService) {
        this.segment = new Segment();
        this.listeSkyboxJour = new Array<THREE.Mesh>();
        this.listeSkyboxNuit = new Array<THREE.Mesh>();
    }

    public initialisation(container: HTMLDivElement): void {
        this.container = container;
        this.creerScene();
        this.scene.add(this.camera);
        this.skyboxService.chargerLesSkybox(this.listeSkyboxJour, this.listeSkyboxNuit);
        this.skyboxService.ajouterSkybox(this.camera, this.listeSkyboxJour);
        this.objetService.ajouterArbreScene(this.scene);
        this.ajoutPisteAuPlan();
        this.sortiePisteService = new SortiePisteService(this.segment.chargerSegmentsDePiste(this.piste));
        this.ajoutZoneDepart();
        this.chargementDesVoitures();
        this.lumiereService.ajouterLumierScene(this.scene);
        this.genererSurfaceHorsPiste();
        this.pointeDeControle.ajouterPointDeControleScene(this.piste, this.scene);
        this.scene.add(new AxisHelper(100));
        this.commencerMoteurDeJeu();
    }

    public configurerTours(nombreTours: number): void {
        this.nombreTours = nombreTours;
        Partie.toursAComplete = this.nombreTours;
    }

    public ajouterRouter(routeur: Router): void {
        this.routeur = routeur;
    }

    public preparerPartie(): void {
        const pilote: Pilote = new Pilote(this.voitureDuJoueur, true);
        const ligneArrivee: LigneArrivee = new LigneArrivee(this.segment.premierSegment[1],
            this.segment.premierSegment[3], this.segment.damierDeDepart);
        const pilotes: Pilote[] = [pilote];
        this.partie = new Partie(pilotes, ligneArrivee, this.nombreTours,
            [this.musiqueService.musique, this], [this.affichageTeteHauteService]);
        this.affichageTeteHauteService.mettreAJourAffichage(pilotes.length, this.nombreTours);
        this.partie.ajouterRouteur(this.routeur);
    }

    public genererSurfaceHorsPiste(): void {
        this.surfaceHorsPisteService = new SurfaceHorsPiste(LONGUEUR_SURFACE_HORS_PISTE, LARGEUR_SURFACE_HORS_PISTE,
            this.segment.chargerSegmentsDePiste(this.piste));
        const terrain = this.surfaceHorsPisteService.genererTerrain();
        terrain.position.z -= 1;
        this.scene.add(terrain);
    }

    public ajouterPiste(piste: Piste): void {
        this.piste = piste;
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 6000);
    }

    public commencerMoteurDeJeu(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.moteurDeJeu();
    }

    public moteurDeJeu(): void {
        setTimeout(() => {
            requestAnimationFrame(() => this.moteurDeJeu());
            this.renderer.render(this.scene, this.camera);
            this.miseAJourPositionVoiture();
            this.skyboxService.rotationSkybox(this.deplacement, this.voitureDuJoueur, this.camera);
        }, 1000 / FPS);
    }

    public miseAJourPositionVoiture(): void {
        if (this.voitureDuJoueur.voiture3D !== undefined) {
            this.cameraService.changementDeVue(this.camera, this.voitureDuJoueur);
            this.deplacement.moteurDeplacement(this.voitureDuJoueur);
            this.voitureDuJoueur.miseAjourPositionCubeDevant();
            this.voitureDuJoueur.miseAjourDirectionDestination(this.piste);
            this.voitureDuJoueur.miseAjourPositionCubeDirectionDestination();
            this.renderMiseAJour();
        }
    }

    public renderMiseAJour(): void {
        if (this.voitureDuJoueur !== undefined) {
            this.sortiePisteService.gererSortiePiste(this.voitureDuJoueur);
            this.piste.gererElementDePiste([this.voitureDuJoueur]);
            this.cameraService.changementDeVue(this.camera, this.voitureDuJoueur);
        }
    }

    public onResize(): void {
        this.camera.aspect = this.getAspectRatio();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    public getAspectRatio(): number {
        return this.container.clientWidth / this.container.clientHeight;
    }

    public ajoutPisteAuPlan(): void {
        const segmentsPiste = this.segment.chargerSegmentsDePiste(this.piste);
        for (let i = 0; i < segmentsPiste.length; i++) {
            this.scene.add(segmentsPiste[i]);
        }
    }

    public ajoutZoneDepart(): void {
        this.scene.add(this.segment.ajoutDamier(this.piste));
        this.scene.add(this.segment.ajoutLigneDepart(this.piste));
    }

    public toucheRelachee(event): void {
        this.deplacement.toucheRelachee(event);
    }

    public touchePesee(event): void {
        this.deplacement.touchePesee(event);
    }

    public chargementDesVoitures(): void {
        const nombreAleatoire = Math.round(Math.random() * 3);
        this.chargerVoiture(TABLEAU_POSITION[nombreAleatoire][0], TABLEAU_POSITION[nombreAleatoire][1], true);
        TABLEAU_POSITION.splice(nombreAleatoire, 1);
        for (let i = 0; i < TABLEAU_POSITION.length; i++) {
            this.chargerVoiture(TABLEAU_POSITION[i][0], TABLEAU_POSITION[i][1], false);
        }
    }

    public chargerVoiture(cadranX: number, cadranY: number, joueur: boolean): void {
        let meshPrincipalVoiture: any;
        this.placementService.calculPositionCentreZoneDepart(this.segment.premierSegment);
        this.placementService.obtenirVecteursSensPiste(this.segment.premierSegment);
        const loader = new THREE.ObjectLoader();
        loader.load(EMPLACEMENT_VOITURE, (obj) => {
            this.objetService.manipulationObjetVoiture(this.segment.premierSegment[1], this.segment.premierSegment[0], obj);
            meshPrincipalVoiture = obj.getObjectByName('MainBody');
            this.configurationVoiturePiste(cadranX, cadranY, obj, joueur);
            this.scene.add(obj);
        });
    }

    public configurationVoiturePiste(cadranX: number, cadranY: number, obj: THREE.Object3D, joueur: boolean): void {
        let meshPrincipalVoiture: any;
        meshPrincipalVoiture = obj.getObjectByName('MainBody');
        if (joueur) {
            meshPrincipalVoiture.material.color.set('grey');
            this.voitureDuJoueur = new Voiture(obj, this.piste);
            this.voitureDuJoueur.creerCubeDevant(this.scene);
            this.voitureDuJoueur.creerCubeDirection(this.scene, this.piste);
            this.calculePositionVoiture(cadranX, cadranY, this.voitureDuJoueur);
            this.preparerPartie();
            this.partie.demarrerPartie();
        } else {
            meshPrincipalVoiture.material.color.set('black');
            this.voituresIA.push(new Voiture(obj, this.piste));
            this.calculePositionVoiture(cadranX, cadranY, this.voituresIA[this.voituresIA.length - 1]);
        }
    }

    public calculePositionVoiture(cadranX: number, cadranY: number, voiture: Voiture) {
        voiture.voiture3D.position.set(
            this.placementService.calculPositionVoiture(cadranX, cadranY, this.segment.premierSegment).x,
            this.placementService.calculPositionVoiture(cadranX, cadranY, this.segment.premierSegment).y, 0);
    }

    public logiquePhares(): void {
        if (!this.phares && this.jour) {
            this.phares = !this.phares;
            this.lumiereService.alternerPhares(this.voitureDuJoueur);
        } else if (this.phares && !this.jour) {
            this.phares = !this.phares;
            this.lumiereService.alternerPhares(this.voitureDuJoueur);
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

    public voirPageFinPartie(): void {
        this.tableauScoreService.temps = (Pilote.tempsTotal / 1000);
        this.tableauScoreService.finPartie = true;
        this.routeur.navigateByUrl(FIN_PARTIE_URL);
    }
}
