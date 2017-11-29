import { Accelerateur } from './../elementsPiste/Accelerateur';
import { NidDePoule } from './../elementsPiste/NidDePoule';
import { FlaqueDEau } from './../elementsPiste/FlaqueDEau';

import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { FacadeLigneService } from './../facadeLigne/facadeligne.service';
import { FacadePointService } from '../facadePoint/facadepoint.service';
import { FacadeCoordonneesService } from '../facadeCoordonnees/facadecoordonnees.service';
import { ContraintesCircuit } from '../contraintesCircuit/contraintesCircuit';
import { Piste } from '../piste/piste.model';
import { ElementDePiste } from '../elementsPiste/ElementDePiste';

@Injectable()
export class RenderService {
  private container: HTMLDivElement;
  public camera: THREE.PerspectiveCamera;
  private plane: THREE.Mesh;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  public pisteAmodifie: Piste;
  public pointsLine;
  public id;
  public points: any[] = new Array();
  public dessinTermine = false;
  public nbSegmentsCroises = 0;
  public nbAnglesPlusPetit45 = 0;
  public nbSegmentsTropProche = 0;
  public facadePointService = new FacadePointService();
  private facadeCoordonneesService = new FacadeCoordonneesService();
  public facadeLigne = new FacadeLigneService();
  private contraintesCircuit = new ContraintesCircuit();
  private listePointElementPiste: THREE.Points[] = new Array();

  public initialize(container: HTMLDivElement): void {
    this.container = container;
    this.scene = this.creerScene();
    this.creerPlan();
    this.initialisationLigne();
    if (this.pisteAmodifie) {
      this.chargerPiste(this.pisteAmodifie.listepositions);
    }
    this.startRenderingLoop();
  }

  public creerScene(): THREE.Scene {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFFFFFF);
    this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 10000);
    this.camera.position.z = 100;
    this.camera.position.x = 100;
    return scene;
  }

  public creerPlan(): void {
    const geometry = new THREE.PlaneGeometry(this.container.clientWidth, this.container.clientHeight);
    const planeMaterial = new THREE.MeshBasicMaterial({
      visible: false
    });
    this.plane = new THREE.Mesh(geometry, planeMaterial);
    this.scene.add(this.plane);
  }

  public initialisationLigne() {
    this.pointsLine = this.facadeLigne.creerLignePoints();
    this.scene.add(this.pointsLine);
  }

  public startRenderingLoop(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.container.appendChild(this.renderer.domElement);
    this.render();
  }

  public render(): void {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
  }

  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }

  public ajouterPoint(point: THREE.Points): void {
    if (!this.dessinTermine) {
      this.scene.add(point);
    }
    this.facadeLigne.ajouterPointLine(point.position, this.facadePointService.compteur, this.pointsLine, this.points);
    this.points.push(point);
    this.facadePointService.compteur++;
  }

  public supprimerPoint(): void {
    this.dessinTermine = false;
    this.scene.remove(this.points[this.points.length - 1]);
    this.points.pop();
    this.actualiserDonnees();
    this.facadeLigne.retirerAncienPointLine(this.facadePointService.compteur, this.pointsLine, this.points);
    if (this.facadePointService.compteur >= 1) {
      this.facadePointService.compteur--;
    }
  }

  public dessinerPoint(event): number {
    let objet, point;
    if (!this.dessinTermine) {
      objet = this.facadeCoordonneesService.obtenirIntersection(event, this.scene, this.camera, this.renderer);
      point = this.facadePointService.creerPoint(objet.point, 'black');
      if (this.points.length === 0) {
        point.material.status = 'premier';
      } else {
        try {
          this.dessinerDernierPoint(point);
        } catch (e) {
          alert(e.message);
          return;
        }
      }
      this.ajouterPoint(point);
      this.actualiserDonnees();
      this.render();
    } else {
      return 0;
    }
  }

  public dessinerDernierPoint(point): void {
    const distance = point.position.distanceTo(this.points[0].position);
    if (distance >= 0 && distance < 3) {
      if (this.points.length > 2) {
        point.position.copy(this.points[0].position);
        this.dessinTermine = true;
      } else {
        throw new Error('une piste a trois points minimum');
      }
    }
  }

  public retourneEtatDessin(): boolean {
    if (this.nbAnglesPlusPetit45 + this.nbSegmentsCroises + this.nbSegmentsTropProche === 0) {
      return this.dessinTermine;
    } else {
      return false;
    }
  }

  public actualiserContrainte(): void {
    this.nbSegmentsCroises = this.contraintesCircuit.nombreLignesCroisees(this.points, this.dessinTermine);
    this.nbSegmentsTropProche = this.contraintesCircuit.nombreSegmentsTropCourts(this.points);
    this.nbAnglesPlusPetit45 = this.contraintesCircuit.nombreAnglesMoins45(
      this.points, this.facadePointService.compteur, this.dessinTermine
    );
  }

  public actualiserDonnees(): void {
    this.facadePointService.restaurerStatusPoints(this.points);
    this.actualiserContrainte();
    this.facadePointService.actualiserCouleurPoints(this.points);
  }

  public viderScene(): void {
    for (let i = 0; i < this.points.length; i++) {
      this.facadeLigne.retirerAncienPointLine(this.facadePointService.compteur, this.pointsLine, this.points);
      this.scene.remove(this.points[i]);
      this.facadePointService.compteur--;
    }
  }

  public reinitialiserScene(): void {
    this.viderScene();
    this.facadePointService.viderListeDesPoints(this.points);
    this.dessinTermine = false;

  }

  public chargerPiste(position: any) {
    for (let i = 0; i < position.length; i++) {
      this.dessinerPointDejaConnu(position[i]);
    }
  }

  public obtenirPositions(): THREE.Vector3[] {
    const vecteur: THREE.Vector3[] = [];
    for (const point of this.points) {
      vecteur.push(new THREE.Vector3(point.position.x, point.position.y, point.position.z));
    }
    return vecteur;
  }

  // public ajouterElementDePiste(position: THREE.Vector3, couleur: string): void {
  //   const point = this.facadePointService.creerPoint(position, couleur);
  //   this.scene.add(point);
  // }

  private viderElementsPiste(): void {
    for (const point of this.listePointElementPiste) {
      this.scene.remove(point);
    }
  }

  public afficherElementsDePiste(listeElement: ElementDePiste[]): void {
    this.viderElementsPiste();
    let couleur: string;
    let position: THREE.Vector3;


    for (let i = 0; i < listeElement.length; i++) {
      if (listeElement[i] instanceof FlaqueDEau) {
        couleur = '#ff0000';
      } else if (listeElement[i] instanceof NidDePoule) {
        couleur = '#0000ff';
      } else if (listeElement[i] instanceof Accelerateur) {
        couleur = '#f9d500';
      }
      position = listeElement[i].position;
      const point = this.facadePointService.creerPoint(position, couleur);
      this.listePointElementPiste.push(point);
      this.scene.add(point);
    }
  }

  public dessinerPointDejaConnu(position: THREE.Vector3) {
    let point;
    if (!this.dessinTermine) {
      point = this.facadePointService.creerPoint(position, 'black');
      if (this.points.length === 0) {
        point.material.status = 'premier';
      } else {
        try {
          this.dessinerDernierPoint(point);
        } catch (e) {
          alert(e.message);
          return;
        }
      }
      this.ajouterPoint(point);
      this.actualiserDonnees();
      this.render();
    } else {
      return 0;
    }
  }
}
