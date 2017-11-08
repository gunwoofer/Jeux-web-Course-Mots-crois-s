import { CameraService } from '../cameraService/cameraService.service';
import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
import { LumiereService } from '../dayNight/dayNight.service';
import { ObjetService } from '../objetService/objet.service';
import { Skybox } from './../skybox/skybox.model';
import { Deplacement } from './deplacement';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';

import { Piste } from '../piste/piste.model';
import { Partie } from '../partie/Partie';
import { Pilote } from '../partie/Pilote';
import { LigneArrivee } from '../partie/LigneArrivee';
import { MusiqueService } from '../musique/musique.service';
import { Router } from '@angular/router';

export const LARGEUR_PISTE = 5;
const EMPLACEMENT_VOITURE = '../../assets/modeles/lamborghini/lamborghini-aventador-pbribl.json';
const FPS = 60;
const MODE_JOUR_NUIT = 'n';
const MODE_FILTRE_COULEUR = 'f';
const CHANGER_VUE = 'c';

@Injectable()
export class GenerateurPisteService {

    private WIDTH = 5000;
    private HEIGHT = 5000;
    private arbrePath = '../../assets/objects/arbre/tree.json';
    private arbreTexture = '../../assets/objects/arbre/tree.jpg';
    private arbrePath2 = '../../assets/objects/arbre2/tree.json';
    private arbreTexture2 = '../../assets/objects/arbre2/tree.jpg';
    private container: HTMLDivElement;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public scene: THREE.Scene;
    private origine: THREE.Vector3;
    private voitureDuJoueur: Voiture;
    private touche: number;
    private deplacement = new Deplacement();
    private skybox = new Skybox();
    private piste: Piste;
    private arbres = new THREE.Object3D();
    private lumierHemisphere: THREE.HemisphereLight;
    private lumiereDirectionnelle: THREE.DirectionalLight;
    private plane: THREE.Mesh;

    private partie: Partie;
    private routeur: Router;

    constructor(private objetService: ObjetService, private lumiereService: LumiereService,
        private filtreCouleurService: FiltreCouleurService, private cameraService: CameraService,
        private musiqueService: MusiqueService) { }

    public initialisation(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.container = container;
        this.creerScene();
        this.scene.add(this.camera);
        this.camera.add(this.skybox.creerSkybox());
        this.creeplane();
        this.chargerArbres();
        this.chargerVoiture();
        this.ajoutPisteAuPlan();
        this.lumiereService.ajouterLumierScene(this.scene);
        this.commencerRendu();
    }

    public ajouterRouter(routeur: Router): void {
        this.routeur = routeur;
    }

    public preparerPartie(): void {
        const pilote: Pilote = new Pilote(this.voitureDuJoueur, true);
        const segmentGeometrie: THREE.Geometry = <THREE.Geometry>this.obtenirPremierSegmentDePiste().geometry;
        const ligneArrivee: LigneArrivee = new LigneArrivee(segmentGeometrie.vertices[0],
            segmentGeometrie.vertices[1]);

        this.partie = new Partie([pilote], ligneArrivee, undefined /* TOURS A COMPLETER ICI */, [this.musiqueService.musique]);

        this.partie.ajouterRouteur(this.routeur);

    }

    private obtenirPremierSegmentDePiste(): THREE.Mesh {
        return this.piste.obtenirSegments3D()[1];
    }

    public ajouterPiste(piste: Piste): void {
        this.piste = piste;
    }

    public creerScene(): void {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 1000);
    }

    public creeplane(): void {
        const geometry = new THREE.PlaneGeometry(this.WIDTH, this.HEIGHT, 32);
        const material = new THREE.MeshPhongMaterial({ color: 'green' });
        material.map = THREE.ImageUtils.loadTexture('../../assets/textures/grass.jpg');
        this.plane = new THREE.Mesh(geometry, material);
        this.plane.receiveShadow = true;
        this.plane.position.z = -0.01;
        this.scene.add(this.plane);
    }

    public commencerRendu(): void {
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.container.appendChild(this.renderer.domElement);
        this.render();
    }

    public render(): void {
        setTimeout(() => {
            requestAnimationFrame(() => this.render());
        }, 1000 / FPS );
        this.renderer.render(this.scene, this.camera);
        if (this.voitureDuJoueur.obtenirVoiture3D() !== undefined) {
            this.cameraService.changementDeVue(this.camera, this.voitureDuJoueur);
            this.deplacement.moteurDeplacement(this.voitureDuJoueur);
            this.renderMiseAJour();
        }
    }

    public renderMiseAJour(): void {
        if (this.voitureDuJoueur !== undefined) {
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
        this.piste.chargerSegments();
        for (let i = 0; i < this.piste.obtenirSegments3D().length; i++) {
            this.scene.add(this.piste.obtenirSegments3D()[i]);
        }
    }

    public toucheRelachee(event): void {
        this.deplacement.toucheRelachee(event);
    }

    public touchePesee(event): void {
        this.deplacement.touchePesee(event);
    }

    public chargerVoiture(): void {
        const loader = new THREE.ObjectLoader();
        loader.load(EMPLACEMENT_VOITURE, (obj) => {
            obj.rotateX(Math.PI / 2);
            obj.name = 'Voiture';
            this.objetService.enleverObjet(obj);
            obj.receiveShadow = true;
            this.scene.add(obj);
            this.voitureDuJoueur = new Voiture(obj);
            this.preparerPartie();
            this.partie.demarrerPartie();
        });
    }

    public chargerArbres(): void {
        this.arbres = this.objetService.chargerArbre(this.arbrePath, this.arbreTexture, this.WIDTH);
        this.scene.add(this.arbres);
    }

    public gestionEvenement(event): void {
        if (event.key === MODE_JOUR_NUIT) {
            this.lumiereService.modeJourNuit(event, this.scene);
        } else if (event.key === MODE_FILTRE_COULEUR) {
            this.filtreCouleurService.mettreFiltre(event, this.scene);
        } else if (event.key === '+' || event.key === '-') {
            this.cameraService.zoom(event, this.camera);
        } else if (event.key === CHANGER_VUE) {
            this.voitureDuJoueur.vueDessusTroisieme = !this.voitureDuJoueur.vueDessusTroisieme;
        }
    }
}
