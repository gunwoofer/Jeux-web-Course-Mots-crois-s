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
  private rayCaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private points: THREE.Points[] = [];
  private lignes: any[] = [];


  private drawIsfinished = false;
  private cameraZ = 400;
  private nearClippingPane = 1;
  private farClippingPane = 1000;
  public rotationSpeedX = 0.005;
  public rotationSpeedY = 0.01;
  private compteur = 0;

  // Creation d'un point
  private creerPoint(coordonnees: THREE.Vector3, couleur: string) {
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
    console.log(couleur);
    return point;
  }

  // Creation d'une ligne
  private creerLigne(startPoint: THREE.Vector3, finalPoint: THREE.Vector3) {
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
  private creerPlan() {
    const geometry = new THREE.PlaneGeometry(this.container.clientWidth, this.container.clientHeight);
    const planeMaterial = new THREE.MeshBasicMaterial({
      visible: false
    });
    this.plane = new THREE.Mesh(geometry, planeMaterial);
    this.scene.add(this.plane);
  }

  // Dessin des points
  public dessinerPoint(event) {
    this.rayCaster = new THREE.Raycaster();
    let intersection: any[] = [];
    let objet, ligne, point;
    this.mouse = this.getCoordinate(event);
    this.rayCaster.setFromCamera(this.mouse, this.camera);
    intersection = this.rayCaster.intersectObjects(this.scene.children);
    if (intersection.length > 0 && !this.drawIsfinished) {
      objet = intersection[0];
        point = this.creerPoint(objet.point, 'red');
      if (this.points.length > 0) {
        point.material.color.set('green');
        const distance = point.position.distanceTo(this.points[0].position);
        if (distance >= 0 && distance < 2) {
          point = this.points[0];
          this.drawIsfinished = true;
        }
        ligne = this.creerLigne(this.points[this.compteur].position, point.position);
        this.scene.add(ligne);
        this.compteur++;
      }
      this.scene.add(point);
      this.points.push(point);
      this.render();
    } else {
        alert('Dessin termine');
    }
  }

  private getCoordinate(event) {
    event.preventDefault();
    const rectangle = this.renderer.domElement.getBoundingClientRect();
    const vector = new THREE.Vector2();
    vector.x = ((event.clientX - rectangle.left) / (rectangle.right - rectangle.left)) * 2 - 1;
    vector.y = - ((event.clientY - rectangle.top) / (rectangle.bottom - rectangle.top)) * 2 + 1;
    return new THREE.Vector2(vector.x, vector.y);
  }

  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFFFFF);
    /* Camera */
    const aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 200;
  }

  private getAspectRatio() {
    return this.container.clientWidth / this.container.clientHeight;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(this.renderer.domElement);
    this.render();
  }

  private render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
    this.stats.update();
  }

  private initStats() {
    this.stats = new Stats();
    this.stats.dom.style.position = 'absolute';
    this.container.appendChild(this.stats.dom);
  }

  public onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public initialize(container: HTMLDivElement) {
    this.container = container;
    this.createScene();
    this.creerPlan();
    this.initStats();
    this.startRenderingLoop();
  }
}

