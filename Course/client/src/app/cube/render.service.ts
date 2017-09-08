import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Stats = require('stats.js');

@Injectable()
export class RenderService {

  private container: HTMLDivElement;

  private camera: THREE.PerspectiveCamera;

  private stats: Stats;

  private cube: THREE.Mesh;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private cameraZ = 400;

  private fieldOfView = 70;

  private nearClippingPane = 1;

  private farClippingPane = 1000;

  public rotationSpeedX = 0.005;

  public rotationSpeedY = 0.01;

  private animateCube() {
    //this.cube.rotation.x += this.rotationSpeedX;
    //this.cube.rotation.y += this.rotationSpeedY;
    //this.cube.translateX(10);
  }
public createPoint( event ) { // Creation du point
    const geometry = new THREE.Geometry();

    geometry.vertices.push(
      new THREE.Vector3( 0, 0, 0), // Le point se place l'origine de la fenetre quand on clique
    );

    var dotMaterial = new THREE.PointsMaterial({
      size: 10,
      color: 0x000000,
      opacity: 1
    });

    var dot = new THREE.Points( geometry, dotMaterial );

    this.scene.add(dot);
  }

  private createCube() {
    const geometry = new THREE.BoxGeometry(200, 200, 200);

    for (let i = 0; i < geometry.faces.length; i += 2) {
      const hex = Math.random() * 0xffffff;
      geometry.faces[i].color.setHex(hex);
      geometry.faces[i + 1].color.setHex(hex);
    }

    

    const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });
    this.cube = new THREE.Mesh(geometry, material);
    //this.scene.add(this.cube);
  }

  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xFFFFFF );

    /* Camera */
    const aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000);
    this.camera.position.z = 500;
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
    this.animateCube();

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

  public initialize(container: HTMLDivElement, rotationX: number, rotationY: number) {
    this.container = container;
    this.rotationSpeedX = rotationX;
    this.rotationSpeedY = rotationY;

    this.createScene();
    this.createCube();
    //this.createPoint();
    this.initStats();
    this.startRenderingLoop();
  }
}
