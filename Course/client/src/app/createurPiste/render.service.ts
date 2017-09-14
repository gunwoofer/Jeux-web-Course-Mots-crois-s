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

  private cameraZ = 400;
  private nearClippingPane = 1;
  private farClippingPane = 1000;
  public rotationSpeedX = 0.005;
  public rotationSpeedY = 0.01;


  // creation d'un point
  private createPoint() {

    const geometry = new THREE.Geometry();
    geometry.vertices.push(
      new THREE.Vector3(0, 0, 0)
    );

    const dotMaterial = new THREE.PointsMaterial({
      size: 5,
      color: 0x000000,
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


  public clickPoint(event) { // Creation du point

    let intersects: any[] = [];
    event.preventDefault();
    let rectangle = this.renderer.domElement.getBoundingClientRect();
    this.mouse = new THREE.Vector2();

    this.mouse.x = ((event.clientX - rectangle.left) / (rectangle.right - rectangle.left)) * 2 - 1;
    this.mouse.y = - ((event.clientY - rectangle.top) / (rectangle.bottom - rectangle.top)) * 2 + 1;


    this.rayCaster = this.createRayCaster();
    this.rayCaster.setFromCamera(this.mouse, this.camera);
    intersects = this.rayCaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      let intersect = intersects[0];
      let dot = this.createPoint();
      dot.position.copy(intersect.point).add(intersect.face.normal);
      dot.position.divideScalar(1).floor().multiplyScalar(1).addScalar(1);
      this.scene.add(dot);
      this.objects.push(dot);
      this.render();
    }
    else {
      console.log('Error');
    }
  }

  // creation d'un raycaster
  private createRayCaster() {
    return new THREE.Raycaster();
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

