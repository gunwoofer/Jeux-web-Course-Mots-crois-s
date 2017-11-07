import { Skybox } from './../skybox/skybox.model';
import { Deplacement } from './deplacement';
import { Segment } from './../piste/segment.model';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Voiture } from './../voiture/Voiture';

import { Piste } from '../piste/piste.model';
import { Partie } from '../partie/Partie';
import { Pilote } from '../partie/Pilote';
import { LigneArrivee } from '../partie/LigneArrivee';

export const LARGEUR_PISTE = 5;
const EMPLACEMENT_VOITURE = '../../assets/modeles/lamborghini/lamborghini-aventador-pbribl.json';

@Injectable()
export class GenerateurPisteService {
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

    private partie: Partie;

    public initialisation(container: HTMLDivElement) {
        this.origine = new THREE.Vector3(0, 0, 0);
        this.container = container;
        this.creerScene();
        this.scene.add(this.camera);
        this.camera.add(this.skybox.creerSkybox());
        this.chargerVoiture();
        this.ajoutPisteAuPlan();
        this.commencerRendu();
    }

    public preparerPartie(): void {
        const pilote: Pilote = new Pilote(this.voitureDuJoueur, true);
        const segmentGeometrie: THREE.Geometry = <THREE.Geometry> this.obtenirPremierSegmentDePiste().geometry;
        const ligneArrivee: LigneArrivee = new LigneArrivee(segmentGeometrie.vertices[0],
            segmentGeometrie.vertices[1]);

        this.partie = new Partie( [ pilote ], ligneArrivee /* TOURS A COMPLETER ICI */ );

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
        let relativeCameraOffset = new THREE.Vector3(-8, 8, 0);
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
        this.piste.chargerSegments();
        for (let i = 0 ; i < this.piste.obtenirSegments3D().length; i++) {
            this.scene.add(this.piste.obtenirSegments3D()[i]);
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
        loader.load(EMPLACEMENT_VOITURE, ( obj ) => {
            obj.rotateX(Math.PI / 2);
            obj.name = 'Voiture';
            this.scene.add( obj );
            this.voitureDuJoueur = new Voiture(obj);
            this.preparerPartie();
            this.partie.demarrerPartie();
        });
    }

    public zoom(event): void {
        if (event.key === '+' && this.camera.zoom <= 5) {
            this.camera.zoom += .5;
        }
        if (event.key === '-' && this.camera.zoom > 1) {
            this.camera.zoom -= .5;
        }
    }
}
