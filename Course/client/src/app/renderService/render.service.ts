import { FacadeLigneService } from './../facadeLigne/facadeligne.service';
import { Injectable } from '@angular/core';

import * as THREE from 'three';
import Stats = require('stats.js');

import { FacadePointService } from '../facadePoint/facadepoint.service';
import { FacadeCoordonneesService } from '../facadeCoordonnees/facadecoordonnees.service';
import { ContraintesCircuitService } from '../contraintesCircuit/contraintesCircuit.service';

@Injectable()
export class RenderService {
  private container: HTMLDivElement;
  public camera: THREE.PerspectiveCamera;
  private stats: Stats;
  private cube: THREE.Mesh;
  private plane: THREE.Mesh;
  public renderer: THREE.WebGLRenderer;
  public scene: THREE.Scene;
  private mouse: THREE.Vector2;
  public points = [];

  private pointXVecteur: number[] = [];
  private pointYVecteur: number[] = [];
  public dessinTermine = false;
  private cameraZ = 400;
  private normeSegment = 0;

  public pointsLine;
  private courbe;

  public nbSegmentsCroises = 0;
  public nbAnglesPlusPetit45 = 0;
  public nbSegmentsTropProche = 0;

  public facadePointService = new FacadePointService();
  private facadeCoordonneesService = new FacadeCoordonneesService();
  public facadeLigne = new FacadeLigneService();
  private contraintesCircuitService = new ContraintesCircuitService();

  public initialize(container: HTMLDivElement): void {
    this.container = container;
    this.creerScene();
    this.creerPlan();
    this.initStats();
    this.initialisationLigne();
    this.startRenderingLoop();
  }

  public creerScene(): void {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFFFFF);
    this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 10000);
    this.camera.position.z = 100;
    this.camera.position.x = 100;
  }

  public creerPlan(): void {
    const geometry = new THREE.PlaneGeometry(this.container.clientWidth, this.container.clientHeight);
    const planeMaterial = new THREE.MeshBasicMaterial({
      visible: false
    });
    this.plane = new THREE.Mesh(geometry, planeMaterial);
    this.scene.add(this.plane);
  }

  public initStats(): void {
    this.stats = new Stats();
    this.stats.dom.style.position = 'absolute';
    this.container.appendChild(this.stats.dom);
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
    this.stats.update();
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
    this.redessinerCourbe();
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
      this.redessinerCourbe();
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

  public nombreAnglesMoins45(): void {
    let nbAnglesMoins45 = 0;
    for (let i = 1; i < this.points.length - 1; i++) {
      if (this.contraintesCircuitService.estUnAngleMoins45(i, this.points, this.facadePointService.compteur)) {
        nbAnglesMoins45++;
      }
    }
    if (this.dessinTermine) {
      if (this.contraintesCircuitService.estUnAngleMoins45(0, this.points, this.facadePointService.compteur)) {
        nbAnglesMoins45++;
      }
    }
    this.nbAnglesPlusPetit45 = nbAnglesMoins45;
  }

  public retourneEtatDessin(): boolean {
    if (this.nbAnglesPlusPetit45 + this.nbSegmentsCroises + this.nbSegmentsTropProche === 0) {
      return this.dessinTermine;
    } else {
      return false;
    }
  }

  public nombreSegmentsTropCourts(): void {
    const largeurPiste = 10;
    let segmentTropCourt = 0;
    for (let i = 0; i < this.points.length - 1; i++) {
      const tailleSegment = this.points[i].position.distanceTo(this.points[i + 1].position);
      if (tailleSegment < 2 * largeurPiste) {
        segmentTropCourt++;
        this.points[i].material.status = 'proche';
        this.points[i + 1].material.status = 'proche';
      }
    }
    this.nbSegmentsTropProche = segmentTropCourt;
  }

  private nombreLignesCroisees(): void {
    let nbSegmentsCroises = 0;
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length - 1; j++) {
        const pointA = this.points[i];
        const pointB = this.points[i + 1];
        const pointC = this.points[j];
        const pointD = this.points[j + 1];
        if (this.contraintesCircuitService.segmentsCoises(pointA, pointB, pointC, pointD, this.dessinTermine)) {
          nbSegmentsCroises++;
        }
      }
    }
    this.nbSegmentsCroises = nbSegmentsCroises;
  }

  public actualiserDonnees(): void {
    this.facadePointService.restaurerStatusPoints(this.points);
    this.nombreLignesCroisees();
    this.nombreSegmentsTropCourts();
    this.nombreAnglesMoins45();
    this.facadePointService.actualiserCouleurPoints(this.points);
  }

  private dessinerCourbe(): void {
    let curve;
    const arrayPointPosition = [];
    for (const point of this.points) {
      arrayPointPosition.push(point.position);
    }
    if (this.dessinTermine) {
      arrayPointPosition.pop();
    }
    curve = new THREE.CatmullRomCurve3(arrayPointPosition);
    curve.closed = this.dessinTermine;
    const geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints(100);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    this.courbe = new THREE.Line(geometry, material);
    this.scene.add(this.courbe);
  }

  private retirerCourbe(): void {
    this.scene.remove(this.courbe);
  }

  public redessinerCourbe(): void {
    if (this.courbe) {
      this.retirerCourbe();
    }
    if (this.points.length > 2) {
      this.dessinerCourbe();
    }
  }

  public viderScene(): void {
    for (let i = 0; i < this.points.length; i++) {
      this.facadeLigne.retirerAncienPointLine(this.facadePointService.compteur, this.pointsLine, this.points);
      this.scene.remove(this.points[i]);
      this.retirerCourbe();
      this.facadePointService.compteur--;
    }
  }

  public reinitialiserScene(): void {
    this.viderScene();
    this.facadePointService.viderListeDesPoints(this.points);
    this.dessinTermine = false;
  }
}
