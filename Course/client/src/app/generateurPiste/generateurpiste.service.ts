import { PlacementService } from './../objetService/placementVoiture.service';
import { SkyboxService } from './../skybox/skybox.service';
import { SortiePisteService } from './../sortiePiste/sortiePiste.service';
import { Segment } from './../piste/segment.model';
import { SurfaceHorsPiste } from './../surfaceHorsPiste/surfaceHorsPiste.service';
import { CameraService } from '../cameraService/cameraService.service';
import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
import { LumiereService } from '../lumiere/lumiere.service';
import { ObjetService } from '../objetService/objet.service';
import { Deplacement} from './deplacement.model';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';

import { Piste } from '../piste/piste.model';
import { Partie, NOMBRE_DE_TOURS_PAR_DEFAULT } from '../partie/Partie';
import { Pilote } from '../partie/Pilote';
import { LigneArrivee } from '../partie/LigneArrivee';
import { MusiqueService } from '../musique/musique.service';
import { Router } from '@angular/router';
import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { EtatPartie } from '../partie/Partie';
import { Sujet } from '../../../../commun/observateur/Sujet';

export const LARGEUR_PISTE = 5;
export const EMPLACEMENT_VOITURE = '../../assets/modeles/lamborghini/lamborghini-aventador-pbribl.json';
export const FIN_PARTIE_URL = '/resultatPartie';
export const DUREE_STINGER_MILISECONDES = 3 * Math.pow(10, 3);
export const FPS = 60;
export const MODE_JOUR_NUIT = 'n';
export const MODE_FILTRE_COULEUR = 'f';
export const CHANGER_VUE = 'c';
export const LONGUEUR_SURFACE_HORS_PISTE = 1000;
export const LARGEUR_SURFACE_HORS_PISTE = 1000;
export const ZOOM_AVANT = '+';
export const ZOOM_ARRIERE = '-';
export const ALLUMER_PHARES = 'l';

@Injectable()
export class GenerateurPisteService implements Observateur {

    private WIDTH = 5000;
    private arbrePath = '../../assets/objects/arbre/tree.json';
    private arbreTexture = '../../assets/objects/arbre/tree.jpg';
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    private voitureDuJoueur: Voiture;
    private deplacement = new Deplacement();
    private jour = true;
    private phares = false;
    private sortiePisteService: SortiePisteService;

    private piste: Piste;
    private arbres = new THREE.Object3D();
    private surfaceHorsPisteService: SurfaceHorsPiste;
    private partie: Partie;
    private routeur: Router;
    private segment: Segment;
    private voituresIA: Voiture[] = [];
    public listeSkyboxJour: Array<THREE.Mesh>;
    public listeSkyboxNuit: Array<THREE.Mesh>;
    private nombreTours = NOMBRE_DE_TOURS_PAR_DEFAULT;

    constructor(private objetService: ObjetService, private lumiereService: LumiereService,
        private filtreCouleurService: FiltreCouleurService, private cameraService: CameraService,
        private musiqueService: MusiqueService, private tableauScoreService: TableauScoreService,
        private skyboxService: SkyboxService, private placementService: PlacementService) {
            this.segment = new Segment();
            this.listeSkyboxJour = new Array<THREE.Mesh>();
            this.listeSkyboxNuit = new Array<THREE.Mesh>(); }

    public initialisation(container: HTMLDivElement) {
        this.container = container;
        this.creerScene();
        this.scene.add(this.camera);
        this.skyboxService.chargerLesSkybox(this.listeSkyboxJour, this.listeSkyboxNuit);
        this.skyboxService.ajouterSkybox(this.camera, this.listeSkyboxJour);
        this.chargerArbres();
        this.ajoutPisteAuPlan();

        this.sortiePisteService = new SortiePisteService(this.segment.chargerSegmentsDePiste(this.piste));
        this.ajoutZoneDepart();
        this.chargementDesVoitures();
        this.lumiereService.ajouterLumierScene(this.scene);
        this.genererSurfaceHorsPiste();

        this.commencerMoteurDeJeu();
    }

    public configurerTours(nombreTours: number) {
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

        this.partie = new Partie([pilote], ligneArrivee, this.nombreTours, [this.musiqueService.musique, this]);
        this.voitureDuJoueur.ajouterObservateur(this.partie);
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
        }, 1000 / FPS );
        this.renderer.render(this.scene, this.camera);
        this.miseAJourPositionVoiture();
        this.skyboxService.rotationSkybox(this.deplacement, this.voitureDuJoueur, this.camera);
    }

    public miseAJourPositionVoiture(): void {
        if (this.voitureDuJoueur.voiture3D !== undefined) {
            this.cameraService.changementDeVue(this.camera, this.voitureDuJoueur);
            this.deplacement.moteurDeplacement(this.voitureDuJoueur);
            this.renderMiseAJour();
        }
    }

    public renderMiseAJour(): void {
        if (this.voitureDuJoueur !== undefined) {
            this.sortiePisteService.gererSortiePiste(this.voitureDuJoueur);
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

    public chargerVoiture(A: number, B: number, joueur: boolean): void {
        let objet: any;
        this.placementService.calculPositionCentreZoneDepart(this.segment.premierSegment);
        this.placementService.obtenirVecteursSensPiste(this.segment.premierSegment);
        const loader = new THREE.ObjectLoader();
        loader.load(EMPLACEMENT_VOITURE, (obj) => {
            const vecteurCalculAngle = new THREE.Vector2(
                (this.segment.premierSegment[1].x - this.segment.premierSegment[0].x),
                (this.segment.premierSegment[1].y - this.segment.premierSegment[0].y));
            obj.rotateX(Math.PI / 2);
            obj.rotateY(vecteurCalculAngle.angle());
            obj.name = 'Voiture';
            this.objetService.enleverObjet(obj);
            this.objetService.ajouterPhares(obj);
            this.objetService.eteindreTousLesPhares(obj);
            obj.receiveShadow = true;
            objet = obj.getObjectByName('MainBody');
            if (joueur) {
                objet.material.color.set('grey');
                this.voitureDuJoueur = new Voiture(obj);
                this.voitureDuJoueur.voiture3D.position.set(
                this.placementService.calculPositionVoiture(A, B, this.segment.premierSegment).x,
                this.placementService.calculPositionVoiture(A, B, this.segment.premierSegment).y, 0);
                this.preparerPartie();
                this.partie.demarrerPartie();
            } else {
                objet.material.color.set('black');
                this.voituresIA.push(new Voiture(obj)); 
                this.voituresIA[this.voituresIA.length - 1].voiture3D.position.set(
                this.placementService.calculPositionVoiture(A, B, this.segment.premierSegment).x,
                this.placementService.calculPositionVoiture(A, B, this.segment.premierSegment).y, 0);
            }
            this.scene.add(obj);
        });
    }

    public chargementDesVoitures(): void {
        const nombreAleatoire = Math.round(Math.random() * 3);
        const tableauPosition = [[1, 1], [-1, 1], [ 1, -1], [-1, -1]] ;
        this.chargerVoiture(tableauPosition[nombreAleatoire][0], tableauPosition[nombreAleatoire][1], true);
        tableauPosition.splice(nombreAleatoire, 1);
        for (let i = 0; i < tableauPosition.length; i++) {
            this.chargerVoiture(tableauPosition[i][0], tableauPosition[i][1], false);
        }
    }

    public chargerArbres(): void {
        this.arbres = this.objetService.chargerArbre(this.arbrePath, this.arbreTexture, this.WIDTH);
        this.scene.add(this.arbres);
    }

    public gestionEvenement(event): void {
        if (event.key === MODE_JOUR_NUIT) {
            this.logiquePhares();
            this.lumiereService.modeJourNuit(event, this.scene);
            this.jour = !this.jour;
            this.skyboxService.alternerSkybox(this.jour, this.camera, this.listeSkyboxJour, this.listeSkyboxNuit);
        } else if (event.key === MODE_FILTRE_COULEUR) {
            this.filtreCouleurService.mettreFiltre(event, this.scene);
        } else if (event.key === ZOOM_AVANT || event.key === ZOOM_ARRIERE) {
            this.cameraService.zoom(event, this.camera);
        } else if (event.key === CHANGER_VUE) {
            this.voitureDuJoueur.vueDessusTroisieme = !this.voitureDuJoueur.vueDessusTroisieme;
        } else if (event.key === ALLUMER_PHARES) {
            this.phares = !this.phares;
            this.lumiereService.alternerPhares(this.voitureDuJoueur);
        }
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


    public notifier(sujet: Sujet): void {
        if (this.partie.etatPartie === EtatPartie.Termine) {
            setTimeout(() => {
                this.voirPageFinPartie();
            }, DUREE_STINGER_MILISECONDES);
        }
    }

    public voirPageFinPartie(): void {
        this.tableauScoreService.temps = (Pilote.tempsTotal / 1000).toString();
        this.routeur.navigateByUrl(FIN_PARTIE_URL);
    }
}
