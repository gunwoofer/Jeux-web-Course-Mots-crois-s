import { SkyboxService } from './../skybox/skybox.service';
import { SortiePisteService } from './../sortiePiste/sortiePiste.service';
import { Segment } from './../piste/segment.model';
import { SurfaceHorsPiste } from './../surfaceHorsPiste/surfaceHorsPiste.service';
import { CameraService } from '../cameraService/cameraService.service';
import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
import { LumiereService } from '../dayNight/dayNight.service';
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
import { DUREE_STINGER } from '../musique/musique.model';
import { Router } from '@angular/router';
import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
import { Observateur } from '../../../../commun/observateur/Observateur';
import { EtatPartie } from '../partie/Partie';
import { Sujet } from '../../../../commun/observateur/Sujet';

export const LARGEUR_PISTE = 5;
export const EMPLACEMENT_VOITURE = '../../assets/modeles/lamborghini/lamborghini-aventador-pbribl.json';
export const FIN_PARTIE_URL = '/finPartie';
export const DUREE_STINGER_MILISECONDES = DUREE_STINGER * Math.pow(10, 3);
export const FPS = 60;
export const MODE_JOUR_NUIT = 'n';
export const MODE_FILTRE_COULEUR = 'f';
export const CHANGER_VUE = 'c';
export const DISTANCE_POSITIONNEMENT_ORTHOGONALE = 3;
export const DISTANCE_POSITIONNEMENT_PARALLELE = 5;
export const LONGUEUR_SURFACE_HORS_PISTE = 1000;
export const LARGEUR_SURFACE_HORS_PISTE = 1000;

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
    private sortiePisteService: SortiePisteService;

    private piste: Piste;
    private arbres = new THREE.Object3D();
    private surfaceHorsPisteService: SurfaceHorsPiste;
    private partie: Partie;
    private routeur: Router;
    private segment: Segment;
    private vecteurSensPiste:  THREE.Vector2;
    private vecteurOrthogonalPiste:  THREE.Vector2;
    private centreSegmentDepart: THREE.Vector2;
    private voituresIA: Voiture[] = [];
    public listeSkyboxJour: Array<THREE.Mesh>;
    public listeSkyboxNuit: Array<THREE.Mesh>;
    private nombreTours = NOMBRE_DE_TOURS_PAR_DEFAULT;

    constructor(private objetService: ObjetService, private lumiereService: LumiereService,
        private filtreCouleurService: FiltreCouleurService, private cameraService: CameraService,
        private musiqueService: MusiqueService, private tableauScoreService: TableauScoreService,
        private skyboxService: SkyboxService) {
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

    public chargerVoiturePilote(A: number, B: number): void {
        this.calculPositionCentreZoneDepart(this.segment.premierSegment);
        this.obtenirVecteursSensPiste(this.segment.premierSegment);
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
            this.scene.add(obj);
            this.voitureDuJoueur = new Voiture(obj);
            this.voitureDuJoueur.voiture3D.position.set(
                this.calculPositionVoiture(A, B).x,
                this.calculPositionVoiture(A, B).y, 0);
            this.preparerPartie();
            this.partie.demarrerPartie();
        });
    }

    public chargerVoitureIA(A: number, B: number): void {
        this.calculPositionCentreZoneDepart(this.segment.premierSegment);
        this.obtenirVecteursSensPiste(this.segment.premierSegment);
        const loader = new THREE.ObjectLoader();
        loader.load(EMPLACEMENT_VOITURE, (obj) => {
            const vecteurCalculAngle = new THREE.Vector2(
                (this.segment.premierSegment[1].x - this.segment.premierSegment[0].x),
                (this.segment.premierSegment[1].y - this.segment.premierSegment[0].y));
            obj.rotateX(Math.PI / 2);
            obj.rotateY(vecteurCalculAngle.angle());
            obj.name = 'Voiture IA';
            this.objetService.enleverObjet(obj);
            this.objetService.ajouterPhares(obj);
            this.objetService.eteindreTousLesPhares(obj);
            obj.receiveShadow = true;
            this.scene.add(obj);
            this.voituresIA.push(new Voiture(obj));
            this.voituresIA[this.voituresIA.length - 1].voiture3D.position.set(
                this.calculPositionVoiture(A, B).x,
                this.calculPositionVoiture(A, B).y, 0);
        });
    }

    public chargementDesVoitures(): void {

        const nombreAleatoire = Math.round(Math.random() * 3);
        const position1 = [1, 1];
        const position2 = [-1, 1];
        const position3 = [ 1, -1];
        const position4 = [-1, -1];
        const tableauPosition = [position1, position2, position3, position4] ;

        this.chargerVoiturePilote( tableauPosition[nombreAleatoire][0], tableauPosition[nombreAleatoire][1]);
        tableauPosition.splice(nombreAleatoire, 1);
        console.log('Tableau position' + tableauPosition);
        for (let i = 0; i < tableauPosition.length; i++) {
            this.chargerVoitureIA(tableauPosition[i][0], tableauPosition[i][1]);
            console.log('Voiture' + 'position x :' + tableauPosition[i][0] + 'position y : ' + tableauPosition[i][1] );
        }
    }

    public calculPositionVoiture(cadranX: number, cadranY: number): THREE.Vector2 {
        const vecteurAvanceSensPiste = new THREE.Vector2().copy(this.vecteurSensPiste);
        vecteurAvanceSensPiste.multiplyScalar(DISTANCE_POSITIONNEMENT_PARALLELE * cadranX);
        const vecteurAvanceSensOrthogonal = new THREE.Vector2().copy(this.vecteurOrthogonalPiste);
        vecteurAvanceSensOrthogonal.multiplyScalar(DISTANCE_POSITIONNEMENT_ORTHOGONALE * cadranY);
        return new THREE.Vector2().copy(this.centreSegmentDepart).
        add(vecteurAvanceSensPiste).
        add(vecteurAvanceSensOrthogonal);
    }

    public calculPositionCentreZoneDepart(premierSegment: Array<THREE.Vector3>): void {
       const centreSegmentGaucheX = ((premierSegment[1].x) + premierSegment[0].x) / 2 ;
       const centreSegmentGaucheY = ((premierSegment[0].y) + premierSegment[1].y) / 2;
       const centreSegmentDroiteX = ((premierSegment[3].x) + premierSegment[2].x) / 2;
       const centreSegmentDroiteY = ((premierSegment[2].y) + premierSegment[3].y) / 2;
       const centreSegmentX = (centreSegmentGaucheX + centreSegmentDroiteX) / 2;
       const centreSegmentY = (centreSegmentGaucheY + centreSegmentDroiteY) / 2;
       this.centreSegmentDepart = new THREE.Vector2(centreSegmentX, centreSegmentY);
   }

   public obtenirVecteursSensPiste(premierSegment: Array<THREE.Vector3>): void {
        this.vecteurSensPiste = new THREE.Vector2(
            (premierSegment[1].x - premierSegment[0].x), (premierSegment[1].y - premierSegment[0].y)).normalize();
        this.vecteurOrthogonalPiste = new THREE.Vector2(-this.vecteurSensPiste.y, this.vecteurSensPiste.x);
    }


    public chargerArbres(): void {
        this.arbres = this.objetService.chargerArbre(this.arbrePath, this.arbreTexture, this.WIDTH);
        this.scene.add(this.arbres);
    }

    public gestionEvenement(event): void {
        if (event.key === MODE_JOUR_NUIT) {
            this.lumiereService.modeJourNuit(event, this.scene, this.voitureDuJoueur);
            this.jour = !this.jour;
            this.skyboxService.alternerSkybox(this.jour, this.camera, this.listeSkyboxJour, this.listeSkyboxNuit);
        } else if (event.key === MODE_FILTRE_COULEUR) {
            this.filtreCouleurService.mettreFiltre(event, this.scene);
        } else if (event.key === '+' || event.key === '-') {
            this.cameraService.zoom(event, this.camera);
        } else if (event.key === CHANGER_VUE) {
            this.voitureDuJoueur.vueDessusTroisieme = !this.voitureDuJoueur.vueDessusTroisieme;
        }
    }


    public notifier(sujet: Sujet): void {
        if (this.partie.etatPartie === EtatPartie.Termine) {
            setInterval(this.voirPageFinPartie(), DUREE_STINGER_MILISECONDES);
        }
    }

    public voirPageFinPartie(): void {
        this.tableauScoreService.temps = (Pilote.tempsTotal / 1000).toString();
        this.routeur.navigateByUrl(FIN_PARTIE_URL);
    }
}
