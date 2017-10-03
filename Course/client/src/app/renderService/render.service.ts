import { FacadeLigneService } from './../facadeLigne/facadeligne.service';
import { Injectable } from '@angular/core';

import * as THREE from 'three';
import Stats = require('stats.js');

import { FacadePointService } from '../facadePoint/facadepoint.service';
import { FacadeCoordonneesService } from '../facadeCoordonnees/facadecoordonnees.service';

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

  public initialisationLigne() {
    this.pointsLine = this.facadeLigne.creerLignePoints();
    this.scene.add(this.pointsLine);
  }

  public initialize(container: HTMLDivElement): void {
    this.container = container;
    this.creerScene();
    this.creerPlan();
    this.initStats();
    this.initialisationLigne();
    this.startRenderingLoop();
  }

  public obtenirLigneDeDepart(): number[] {
    const positions = [];
    if (this.pointsLine.geometry.attributes.position.array.length > 0) {
      for (let i = 0; i < 6; i++) {
        positions[i] = this.pointsLine.geometry.attributes.position.array[i];
      }
      return positions;
    } else {
      return null;
    }
  }
  /**********************************************************
                     Gestion Point
   *********************************************************/
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

  public afficherMessageErreurs(): string {
    let message = '';
    if (this.nbAnglesPlusPetit45 > 0) {
      message += 'Angle(s) inférieurs à 45° => ' + this.nbAnglesPlusPetit45 + ' ; ';
    }
    if (this.nbSegmentsTropProche > 0) {
      message += 'Segment(s) trop proche(s) => ' + this.nbSegmentsTropProche + ' ; ';
    }
    if (this.nbSegmentsCroises > 0) {
      message += 'Segment(s) croisé(s) => ' + this.nbSegmentsCroises + ' ; ';
    }
    return message;
  }
  /**********************************************************
                      Gestion angles
   *********************************************************/
  public nombreAnglesMoins45(): void {
    let nbAnglesMoins45 = 0;
    for (let i = 1; i < this.points.length - 1; i++) {
      if (this.estUnAngleMoins45(i)) {
        nbAnglesMoins45++;
      }
    }
    if (this.dessinTermine) {
      if (this.estUnAngleMoins45(0)) {
        nbAnglesMoins45++;
      }
    }
    this.nbAnglesPlusPetit45 = nbAnglesMoins45;
  }

  public estUnAngleMoins45(numeroPoint: number): boolean {
    if (this.points.length > 1) {
      const angle = this.calculerAngle(numeroPoint);
      if (angle <= 0.785398163) {
        this.points[numeroPoint].material.status = 'angle45';
        return true;
      }
    }
    return false;
  }

  public calculerAngle(numeroPoint: number): number {
    if (this.points.length > 1) {
      const point1 = this.points[numeroPoint === 0 ? this.facadePointService.compteur - 1 : numeroPoint - 1];
      const point2 = this.points[numeroPoint];
      const point3 = this.points[numeroPoint + 1];
      const premierSegment = new THREE.Vector2(point3.position.x - point2.position.x, point3.position.y - point2.position.y).normalize();
      const precedentSegement = new THREE.Vector2(point2.position.x - point1.position.x, point2.position.y - point1.position.y).normalize();
      const produitScalaire = (premierSegment.x) * (-precedentSegement.x) + (premierSegment.y) * (-precedentSegement.y);
      const angle = Math.acos(produitScalaire);
      return angle;
    }
    return NaN;
  }
  /**********************************************************
                     Fonctions initialisation
   *********************************************************/
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

  public getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
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

  public retourneEtatDessin(): boolean {
    if (this.nbAnglesPlusPetit45 + this.nbSegmentsCroises + this.nbSegmentsTropProche === 0) {
      return this.dessinTermine;
    } else {
      return false;
    }
  }
  /**********************************************************
                   Gestion longueur segment
   *********************************************************/
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
  /**********************************************************
                  Gestion croisements
   *********************************************************/
  private segmentsCoises(pointA, pointB, pointC, pointD): boolean {
    const vectAB = [pointB.position.x - pointA.position.x, pointB.position.y - pointA.position.y];
    const vectAC = [pointC.position.x - pointA.position.x, pointC.position.y - pointA.position.y];
    const vectAD = [pointD.position.x - pointA.position.x, pointD.position.y - pointA.position.y];
    const vectCA = vectAC.map(function (x) { return x * -1; });
    const vectCB = [pointB.position.x - pointC.position.x, pointB.position.y - pointC.position.y];
    const vectCD = [pointD.position.x - pointC.position.x, pointD.position.y - pointC.position.y];
    const determinantABAC = vectAB[0] * vectAC[1] - vectAB[1] * vectAC[0];
    const determinantABAD = vectAB[0] * vectAD[1] - vectAB[1] * vectAD[0];
    const determinantCDCB = vectCD[0] * vectCB[1] - vectCD[1] * vectCB[0];
    const determinantCDCA = vectCD[0] * vectCA[1] - vectCD[1] * vectCA[0];
    if (Math.sign(determinantABAC) === 0 || Math.sign(determinantCDCB) === 0) {
      return false;
    } else if (Math.sign(determinantABAC) !== Math.sign(determinantABAD) && Math.sign(determinantCDCB) !== Math.sign(determinantCDCA)) {
      if (this.dessinTermine) {
        if (vectAD[0] === 0 && vectAD[1] === 0) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  private nombreLignesCroisees(): void {
    let nbSegmentsCroises = 0;
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length - 1; j++) {
        const pointA = this.points[i];
        const pointB = this.points[i + 1];
        const pointC = this.points[j];
        const pointD = this.points[j + 1];
        if (this.segmentsCoises(pointA, pointB, pointC, pointD)) {
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
  /**********************************************************
          Gestion génération de la courbe
   *********************************************************/
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

  public pointyMinimum(): number {
    const pointsY: number[] = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      pointsY.push(this.points[i].position.y);
    }
    return Math.min.apply(null, pointsY);
  }

  public placementPointPlusBas(): void {
    const pointMinimum = this.pointyMinimum();
    const longueurListe = this.points.length - 1;
    let positionPointMinimum = 0;
    let distanceDepointDepart = 0;
    const han = [];
    for (let i = 0; i < longueurListe; i++) {
      if (pointMinimum === this.points[i].position.y) {
        positionPointMinimum = i;
        distanceDepointDepart = (positionPointMinimum <= longueurListe / 2) ? i : longueurListe - positionPointMinimum;
      }
    }
  }

  public viderListeDesPoints(): void {
    for (let i = this.points.length - 1; i >= 0; i--) {
      this.points.pop();
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
    this.viderListeDesPoints();
    this.dessinTermine = false;
  }
}
