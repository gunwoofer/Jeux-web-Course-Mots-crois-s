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
  private objects: any[] = [];

  private drawIsfinished = false;
  private cameraZ = 400;
  private nearClippingPane = 1;
  private farClippingPane = 1000;
  public rotationSpeedX = 0.005;
  public rotationSpeedY = 0.01;
  private compteur = 0;



  // creation d'un point
  private createPoint(color: string) {

    const geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(0, 0, 0)
    );

    const dotMaterial = new THREE.PointsMaterial({
      size: 5,
      color: color,
      opacity: 1
    });

    return new THREE.Points(geometry, dotMaterial);

  }

  // creation d'un plane
  private createPLane() {
    const geometry = new THREE.PlaneGeometry(this.container.clientWidth, this.container.clientHeight);
    const planeMaterial = new THREE.MeshBasicMaterial({
      visible: false
    });
    this.plane = new THREE.Mesh(geometry, planeMaterial);
    this.scene.add(this.plane);
  }



  public drawPoint(event) { // Creation du point

    this.rayCaster = new THREE.Raycaster();
    let intersects: any[] = [];
    let objet, dot, line;

    this.mouse = this.getCoordinate(event);
    intersects = this.getIntersectObject(this.rayCaster, this.mouse, this.camera, this.scene);


    if (intersects.length > 0 && !this.drawIsfinished) {
      objet = intersects[0];
      dot = this.objects.length ? this.createPoint("green") : this.createPoint("red");
      dot.position.copy(objet.point);
      if (this.objects.length > 0) {
        let distance = dot.position.distanceTo(this.objects[0].position);
        if(distance >=0 && distance <2)
        {
          dot = this.objects[0];
          this.drawIsfinished = true;
        }
        line = this.drawAline(this.objects[this.compteur].position, dot.position);
        this.scene.add(line);
        this.compteur++;
      }
        
      this.scene.add(dot);
      this.objects.push(dot);
      this.render();
    }
    else
      alert('DRAW IS FINISH');

  }

  private drawAline(startPoint: THREE.Vector3, finalPoint: THREE.Vector3) {
    let material = new THREE.LineBasicMaterial({
      color: "black",
      linewidth: 2
    })
    let geometry = new THREE.Geometry();
    geometry.vertices.push(startPoint);
    geometry.vertices.push(finalPoint);

    return new THREE.Line(geometry, material);

  }


  private getCoordinate(event) {
    event.preventDefault();
    let rectangle = this.renderer.domElement.getBoundingClientRect();
    let vector = new THREE.Vector2();
    vector.x = ((event.clientX - rectangle.left) / (rectangle.right - rectangle.left)) * 2 - 1;
    vector.y = - ((event.clientY - rectangle.top) / (rectangle.bottom - rectangle.top)) * 2 + 1;

    return new THREE.Vector2(vector.x, vector.y);
  }

  private getIntersectObject(rayCaster: THREE.Raycaster,
    mouse: THREE.Vector2,
    camera: THREE.PerspectiveCamera,
    scene: THREE.Scene) {
    rayCaster.setFromCamera(mouse, camera);
    return rayCaster.intersectObjects(scene.children);

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
    this.createPLane();
    this.initStats();
    this.startRenderingLoop();
  }
}

