import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');

@Injectable()
export class RenderService {

  private container: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private stats: Stats;
  private cube: THREE.Mesh;
  private plane: THREE.Mesh;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private fieldOfView = 70;
  private mouse: THREE.Vector2;
  private points: THREE.Points[] = [];
  private lignes: THREE.Line[] = [];

  private pointXVecteur: number[] = [];
  private pointYVecteur: number[] = [];
  private dessinTermine = false;
  private cameraZ = 400;
  private nearClippingPane = 1;
  private farClippingPane = 1000;
  public rotationSpeedX = 0.005;
  public rotationSpeedY = 0.01;
  private compteur = 0;
  private quantiteSegment: number = 0;
  private normeSegment: number = 0;

  // Creation d'un point
  public creerPoint(coordonnees: THREE.Vector3, couleur: string) {
    const geometrie = new THREE.Geometry();
    geometrie.vertices.push(
      new THREE.Vector3(0, 0, 0)
    );
    const materiel = new THREE.PointsMaterial({
        size: 5,
        color: couleur,
        opacity: 1
    });
    const point = new THREE.Points(geometrie, materiel);
    point.position.copy(coordonnees);
    return point;
  }

  // Creation d'une ligne
  public creerLigne(startPoint: THREE.Vector3, finalPoint: THREE.Vector3) {
    const materiel = new THREE.LineBasicMaterial({
      color: 'black',
      linewidth: 2
    });
    const geometrie = new THREE.Geometry();
    geometrie.vertices.push(startPoint);
    geometrie.vertices.push(finalPoint);
    const ligne = new THREE.Line(geometrie, materiel);
    return ligne;
  }

  // Creation d'un plan
  public creerPlan() {
    const geometry = new THREE.PlaneGeometry(this.container.clientWidth, this.container.clientHeight);
    const planeMaterial = new THREE.MeshBasicMaterial({
      visible: false
    });
    this.plane = new THREE.Mesh(geometry, planeMaterial);
    this.scene.add(this.plane);
  }

  public obtenirIntersection(event) {
    const rayCaster = new THREE.Raycaster();
    let intersection: any[] = [];
    this.mouse = this.obtenirCoordonnees(event);
    rayCaster.setFromCamera(this.mouse, this.camera);
    intersection = rayCaster.intersectObjects(this.scene.children);
    return intersection[0];
  }

  public dessinerLigne (point, distance) {
    let ligne;
    if (distance >= 0 && distance < 10) {
      ligne = this.creerLigne(this.points[this.compteur].position, this.points[0].position);
      point.position.set(this.points[0].position);
      this.dessinTermine = true;
    } else {
      ligne = this.creerLigne(this.points[this.compteur].position, point.position);
    }
    this.lignes.push(ligne);
    this.scene.add(ligne);
    this.compteur++;
  }

  // Dessin des points
  public dessinerPoint(event) {
    let objet, ligne, point;
    if (!this.dessinTermine) {
      objet = this.obtenirIntersection(event);
      point = this.creerPoint(objet.point, 'red');
      if (this.points.length > 0) {
        point.material.color.set('orange');
        const distance = point.position.distanceTo(this.points[0].position);
        this.dessinerLigne(point, distance);
      }
      this.scene.add(point);
      this.points.push(point);
      this.render();
    } else {
        alert('Dessin termine');
    }
  }

  public supprimerPoint(event) {
    this.dessinTermine = false;
    this.scene.remove(this.points[this.points.length - 1]);
    this.points.pop();
    this.scene.remove(this.lignes[this.lignes.length - 1]);
    this.lignes.pop();
    if (this.compteur >= 1) {
      this.compteur--;
    }
    console.log("Il n'est pas possible de créer des angles de pistes inférieurs à 45 degrés.  Veuillez proposer une autre section de parcours.");
  }

  public obtenirCoordonnees(event) {

    event.preventDefault();
    const rectangle = this.renderer.domElement.getBoundingClientRect();
    const vector = new THREE.Vector2();
    vector.x = ((event.clientX - rectangle.left) / (rectangle.right - rectangle.left)) * 2 - 1;
    vector.y = - ((event.clientY - rectangle.top) / (rectangle.bottom - rectangle.top)) * 2 + 1;
    const nouveauVectorCalculAngle = new THREE.Vector3();
    const avantDernierVectorCalculAngle = new THREE.Vector3();
    const vectorCalculAngle = new THREE.Vector3();
    const pointX = ((event.clientX - rectangle.left) / (rectangle.right - rectangle.left)) * 2 - 1;
    const pointY = ((event.clientY - rectangle.left) / (rectangle.right - rectangle.left)) * 2 - 1;

    this.pointXVecteur.push(pointX);
    this.pointYVecteur.push(pointY);
    vectorCalculAngle.x = vector.x;
    vectorCalculAngle.y = vector.y;
    vectorCalculAngle.z = 0;

    if (this.estUnAngleMoins45() === true) {
      return new THREE.Vector2(vector.x, vector.y);
    }
  }

    public estUnAngleMoins45() {
    if (this.points.length > 1) {
      const angle = this.calculerAngle();

      if (angle <= 0.785398163) {
      this.interdictionAngle45();
      }
    }
    return true;
  }

  public calculerAngle() {

   if (this.points.length > 1) {

      const point1x = this.pointXVecteur[this.pointXVecteur.length - 3];
      const point2x = this.pointXVecteur[this.pointXVecteur.length - 2];
      const point3x = this.pointXVecteur[this.pointXVecteur.length - 1];
      const point1y = this.pointYVecteur[this.pointYVecteur.length - 3];
      const point2y = this.pointYVecteur[this.pointYVecteur.length - 2];
      const point3y = this.pointYVecteur[this.pointYVecteur.length - 1];

      const premierSegmentx = point3x - point2x;
      const premierSegmenty = point3y - point2y;
      const precedentSegementx = point2x - point1x;
      const precedentSegementy = point2y - point1y;

      const multiplicationEnX = (premierSegmentx) * (-precedentSegementx);
      const multiplicationEnY = (premierSegmenty) * (-precedentSegementy);

      const multiplicationEnZ = 0;
      const resultatNumerateur = multiplicationEnX + multiplicationEnY + multiplicationEnZ;

      const normeSegment = Math.sqrt(Math.pow(premierSegmentx, 2) + Math.pow(premierSegmenty, 2));
      const normeSegmentPrecedent = Math.sqrt(Math.pow(precedentSegementx, 2) + Math.pow(precedentSegementy, 2));

      const resultatDenominateur = normeSegment * normeSegmentPrecedent;

      const divisionParUn = Math.pow(resultatDenominateur, -1);
      const resultatNormalise = divisionParUn * resultatNumerateur;

      const angle = Math.acos(resultatNormalise);

      return angle;
   }
   return 0;
  }

  public interdictionAngle45() {
    alert("Il n'est pas possible de créer des angles de pistes inférieurs à 45 degrés.  Veuillez proposer une autre section de parcours.");
  }


  public creerScene() {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFFFFF);
    /* Camera */
    const aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 200;
  }

  public getAspectRatio() {
    return this.container.clientWidth / this.container.clientHeight;
  }

  public startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(this.renderer.domElement);
    this.render();
  }

  public render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }

  public initStats() {
    this.stats = new Stats();
    this.stats.dom.style.position = 'absolute';
    this.container.appendChild(this.stats.dom);
  }

  public retournerListePoints(){
    if(this.dessinTermine){
      return this.points;
    }
  }

  public retournerListeLines(){
    if (this.dessinTermine){
      return this.lignes;
    }
  }

  public retourneetatDessin(){
    return this.dessinTermine;
  }

  public onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public initialize(container: HTMLDivElement) {
    this.container = container;
    this.creerScene();
    this.creerPlan();
    this.initStats();
    this.startRenderingLoop();
  }
}

