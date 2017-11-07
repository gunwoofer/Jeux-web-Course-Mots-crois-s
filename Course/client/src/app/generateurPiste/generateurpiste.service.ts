import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
import { LumiereService } from '../dayNight/dayNight.service';
import { ObjetRandomService } from '../ObjectRandom/objetRandom.service';
import { Skybox } from './../skybox/skybox.model';
import { Deplacement } from './deplacement';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';
import { Segment } from './../piste/segment.model';

import { Piste } from '../piste/piste.model';
import { Partie } from '../partie/Partie';
import { Pilote } from '../partie/Pilote';
import { LigneArrivee } from '../partie/LigneArrivee';

export const LARGEUR_PISTE = 5;
const EMPLACEMENT_VOITURE = '../../assets/modeles/lamborghini/lamborghini-aventador-pbribl.json';

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
    private touchePrecedente: number;
    private deplacement = new Deplacement();
    private skybox = new Skybox();
    private piste: Piste;
    private arbres = new THREE.Object3D();
    private lumierHemisphere: THREE.HemisphereLight;
    private lumiereDirectionnelle: THREE.DirectionalLight;
    private plane: THREE.Mesh;
    private segmentsPisteVisuel: THREE.Mesh[] = new Array() ;
    private segmentsPisteVisuelZoneDepart: THREE.Mesh;
    private segmentsPisteVisuelLigneDepart: THREE.Line;
    private segment: Segment;
    private distancePremiereVoitureEnX: number;
    private distancePremiereVoitureENY: number;

    private partie: Partie;

    constructor(private objetRandomService: ObjetRandomService, private lumiereService: LumiereService,
        private filtreCouleurService: FiltreCouleurService) {this.segment = new Segment(); }


    public initialisation(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.container = container;
        this.creerScene();
        this.scene.add(this.camera);
        // this.camera.add(this.skybox.creerSkybox());
        this.creeplane();
        this.chargerArbres();
        this.chargerVoiture();
        this.ajoutPisteAuPlan();
        this.lumiereService.ajouterLumierScene(this.scene);
        this.commencerRendu();
    }

    public preparerPartie(): void {
        const pilote: Pilote = new Pilote(this.voitureDuJoueur, true);
        const segmentGeometrie: THREE.Geometry = <THREE.Geometry>this.obtenirPremierSegmentDePiste().geometry;
        const ligneArrivee: LigneArrivee = new LigneArrivee(segmentGeometrie.vertices[0],
            segmentGeometrie.vertices[1]);

        this.partie = new Partie([pilote], ligneArrivee /* TOURS A COMPLETER ICI */);

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
        requestAnimationFrame(() => this.render());
        this.renderer.render(this.scene, this.camera);
        if (this.voitureDuJoueur.obtenirVoiture3D() !== undefined) {
            if (this.voitureDuJoueur.vueDessusTroisieme) {
                this.vueTroisiemePersonne();
            } else {
                this.vueDessus();
            }
            this.vueMiseAjour();
        }
    }

    public renderMiseAJour(): void {
        this.renderer.render(this.scene, this.camera);
        if (this.voitureDuJoueur !== undefined) {
            if (this.voitureDuJoueur.vueDessusTroisieme) {
                this.vueTroisiemePersonne();
            } else {
                this.vueDessus();
            }
            this.vueMiseAjour();
        }
    }

    public vueMiseAjour(): void {
        this.camera.lookAt(this.voitureDuJoueur.obtenirVoiture3D().position);
        this.camera.updateMatrix();
        this.camera.updateProjectionMatrix();
    }

    public vueDessus(): void {
        this.camera.position.y = this.voitureDuJoueur.obtenirVoiture3D().position.y;
        this.camera.position.x = this.voitureDuJoueur.obtenirVoiture3D().position.x;
        this.camera.position.z = this.voitureDuJoueur.obtenirVoiture3D().position.z + 50;
    }

    public vueTroisiemePersonne(): void {
        let relativeCameraOffset = new THREE.Vector3(-5, 2, 0);
        relativeCameraOffset = relativeCameraOffset.applyMatrix4(this.voitureDuJoueur.obtenirVoiture3D().matrixWorld);
        this.camera.position.set(relativeCameraOffset.x, relativeCameraOffset.y, relativeCameraOffset.z);
        this.camera.up = new THREE.Vector3(0, 0, 1);
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
        this.segmentsPisteVisuel = this.segment.chargerSegmentsDePiste(this.piste);
        this.segmentsPisteVisuelZoneDepart = this.segment.ajoutZoneDepart(this.piste);
        this.segmentsPisteVisuelLigneDepart = this.segment.ajoutLigneDepart(this.piste);

        this.scene.add(this.segmentsPisteVisuelZoneDepart);
        this.scene.add(this.segmentsPisteVisuelLigneDepart);
        


        for (let i = 0 ; i < this.segmentsPisteVisuel.length; i++) {
            this.scene.add(this.segmentsPisteVisuel[i]);
        
        }
    }

    public deplacementVoiture(event): void {
        this.voitureDuJoueur.vitesse += 0.05;
        this.deplacement.deplacementVoiture(event, this.voitureDuJoueur.obtenirVoiture3D(),
            this.touche, this.touchePrecedente, this.voitureDuJoueur);
        this.renderMiseAJour();

    }

    public toucheRelachee(event): void {
        this.voitureDuJoueur.vitesse = 0;
        this.deplacement.toucheRelachee(event, this.touche);
    }

    public chargerVoiture(): void {
        const loader = new THREE.ObjectLoader();
        loader.load(EMPLACEMENT_VOITURE, (obj) => {
            obj.rotateX(Math.PI / 2);
            obj.name = 'Voiture';
            obj.remove(obj.getChildByName('Plane'));
            obj.remove(obj.getChildByName('SpotLight'));
            obj.remove(obj.getChildByName('SpotLight1'));
            this.scene.add(obj);
            this.voitureDuJoueur = new Voiture(obj);
            this.preparerPartie();
            this.partie.demarrerPartie();
            console.log(obj.children);
            let premierSegment : THREE.Geometry = <THREE.Geometry> this.segmentsPisteVisuel[1].geometry; 
        
        });
    }

    public calculPositionVoiture(premierSegment: Array<THREE.Vector3>): THREE.Vector3 {
        
        
                
        const centreSegmentGaucheX = ((premierSegment[1].x) + premierSegment[0].x)/2;  
        const centreSegmentGaucheY = ((premierSegment[1].y+ premierSegment[0].y))/2;  
 
        const centreSegmentDroiteX = ((premierSegment[3].x) + premierSegment[2].x)/2;  
        const centreSegmentDroiteY = ((premierSegment[3].y) + premierSegment[2].y)/2;  
        const centreSegmentX = (centreSegmentGaucheX+centreSegmentDroiteX)/2;  
        const centreSegmentY = (centreSegmentGaucheY+centreSegmentDroiteY)/2;  
        
        return new THREE.Vector3(centreSegmentX, centreSegmentY, 0);
        
    }

    public zoom(event): void {
        if (event.key === '+' && this.camera.zoom <= 5) {
            this.camera.zoom += .5;
        }
        if (event.key === '-' && this.camera.zoom > 1) {
            this.camera.zoom -= .5;
        }
    }

    public chargerArbres(): void {
        this.arbres = this.objetRandomService.chargerArbre(this.arbrePath, this.arbreTexture, this.WIDTH);
        this.scene.add(this.arbres);
    }

    public gestionEvenement(event): void {
        if (event.keyCode === 110) {
            this.lumiereService.modeJourNuit(event, this.scene);
        } else if (event.keyCode === 102) {
            this.filtreCouleurService.mettreFiltre(event, this.scene);
        }
    }
    public changerModeNuit(event): void {
        this.lumiereService.modeJourNuit(event, this.scene);
    }

    public filtreDaltonin(event): void {
        this.filtreCouleurService.mettreFiltre(event, this.scene);
    }
}
