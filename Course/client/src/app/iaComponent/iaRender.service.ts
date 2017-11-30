import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { AxisHelper } from 'three';

@Injectable()
export class IaRenderService {
  private ANGLEROTATION = 0.1;

  private controls: THREE.TrackballControls;

  private container: HTMLDivElement;

  //private camera: THREE.PerspectiveCamera;
  private camera: THREE.OrthographicCamera;

  private cube: THREE.Mesh;
  private cubeDirectionDestination: THREE.Mesh;
  private indicateurDevant: THREE.Mesh;


  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private cameraZ = 400;

  private fieldOfView = 70;

  private nearClippingPane = 1;

  private farClippingPane = 10000;

  public rotationSpeedX = 0.005;

  public rotationSpeedY = 0.01;

  private listeCube: any[] = [];

  private directionDestination: THREE.Vector3;
  private directionDevantCube: THREE.Vector3;

  private indiceCubeAAtteindre: number;

  public initialize(container: HTMLDivElement, rotationX: number, rotationY: number) {
    this.container = container;
    this.rotationSpeedX = rotationX;
    this.rotationSpeedY = rotationY;
    this.createScene();
    this.cube = this.createVoiture(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.cube);
    this.scene.add(new AxisHelper(100));
    this.indiceCubeAAtteindre = 0;
    this.creerCubes();
    this.miseAjourDirectionDestination();
    this.creerCubeDirection();
    this.miseAjourPositionCubeDirectionDestination();
    this.creerCubeDeplacement();
    this.miseAjourPositionCubeDeplacement();
    this.startRenderingLoop();
  }

  private createVoiture(position: THREE.Vector3) {
    const geometry = new THREE.BoxGeometry(40, 20, 20);
    geometry.faces[0].color.setHex(Math.random() * 0xffffff);
    const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });
    const cubeRetourne = new THREE.Mesh(geometry, material);
    cubeRetourne.position.set(position.x, position.y, position.z);
    return cubeRetourne;
  }

  private createCube(position: THREE.Vector3, size: number = 1): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(20 * size, 20 * size, 20 * size);
    geometry.faces[0].color.setHex(Math.random() * 0xffffff);
    const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, overdraw: 0.5 });
    const cubeRetourne = new THREE.Mesh(geometry, material);
    cubeRetourne.position.set(position.x, position.y, position.z);
    return cubeRetourne;
  }

  private creerCubes() {
    for (let i = 0; i < 4; i++) {
      const cubeCree = this.createCube(new THREE.Vector3(800 * (Math.random() - 0.5), 400 * Math.random(), 0));
      this.listeCube.push(cubeCree);
      this.scene.add(cubeCree);
      this.listeCube[i].material.color.setHex((i + 1) * 0x222211);
    }
  }

  private createScene() {
    this.scene = new THREE.Scene();
    const aspectRatio = this.getAspectRatio();
    this.camera = new THREE.OrthographicCamera(
      this.container.clientWidth / -2, this.container.clientWidth / 2, this.container.clientHeight / 2, this.container.clientHeight / -2, 1, 1000
    );
    this.camera.position.z = this.cameraZ;
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
    this.avancerCube();
    this.miseAjourDirectionDestination();
    this.miseAjourPositionCubeDirectionDestination();
    this.miseAjourPositionCubeDeplacement();
    this.faireTournerCube(this.obtenirSensRotationVoiture());
    if (this.listeCube[this.indiceCubeAAtteindre].position.distanceTo(this.cube.position) < 10) {
      this.indiceCubeAAtteindre = this.indiceCubeAAtteindre + 1;
    }
    if (this.indiceCubeAAtteindre === this.listeCube.length) {
      this.indiceCubeAAtteindre = 0;
    }

    this.renderer.render(this.scene, this.camera);
  }

  public onResize() {
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  private avancerCube() {
    this.cube.translateX(5);
  }

  /// DECLARATION ET MISE A JOUR D VECTEURS

  private miseAjourDirectionDestination() {
    this.directionDestination = new THREE.Vector3()
      .copy(this.listeCube[this.indiceCubeAAtteindre].position)
      .add(new THREE.Vector3()
        .copy(this.cube.position)
        .negate()).normalize();
  }

  private creerCubeDirection() {
    this.cubeDirectionDestination = this.createCube(new THREE.Vector3()
      .copy(this.cube.position)
      .add(this.directionDestination), 0.3);
    this.scene.add(this.cubeDirectionDestination);
  }

  private miseAjourPositionCubeDirectionDestination() {
    const positionIndicDirection = new THREE.Vector3()
      .copy(this.cube.position)
      .add(new THREE.Vector3()
        .copy(this.directionDestination)
        .multiplyScalar(50));
    this.cubeDirectionDestination.position.set(positionIndicDirection.x, positionIndicDirection.y, positionIndicDirection.z);
  }

  private creerCubeDeplacement() {
    this.indicateurDevant = this.createCube(new THREE.Vector3().copy(this.cube.position).add(this.directionDestination), 0.5);
    this.scene.add(this.indicateurDevant);
  }

  private miseAjourPositionCubeDeplacement() {
    const angleOrientationCube = this.cube.getWorldRotation().z;
    const vecteurDirection = new THREE.Vector3(Math.cos(angleOrientationCube), Math.sin(angleOrientationCube), 0);
    this.directionDevantCube = new THREE.Vector3().copy(vecteurDirection);
    const positionIndicDeplacement = new THREE.Vector3()
      .copy(this.cube.position)
      .add(vecteurDirection.multiplyScalar(50));
    this.indicateurDevant.position.set(positionIndicDeplacement.x, positionIndicDeplacement.y, positionIndicDeplacement.z);
  }

  private faireTournerCube(sens: number) {
    this.cube.rotateZ(this.ANGLEROTATION * sens);
  }

  private obtenirSensRotationVoiture(): number { // >0 --> Gauche
    const signeProduitVectoriel = new THREE.Vector3()
      .copy(this.directionDevantCube)
      .cross(new THREE.Vector3()
        .copy(this.directionDestination));
    return Math.sign(signeProduitVectoriel.z);
  }
}
