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
  private points: any [] = [];
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


  private mouseDownTime;
  private mouseUpTime;
  private dragMode;
  private pointHover;
  private objectDragged;

  private courbe;

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
    point.geometry.computeBoundingSphere();
    point.geometry.boundingSphere.radius = 100;
    point.name = '' + this.compteur;
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
      point.position.copy(this.points[0].position);
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
    let objet, point;
    if (!this.dessinTermine) {
      objet = this.obtenirIntersection(event);
      point = this.creerPoint(objet.point, 'red');
      point.material.normalColor = 'red';
      if (this.points.length > 0) {
        point.material.color.set('orange');
        point.material.normalColor = 'orange';
        const distance = point.position.distanceTo(this.points[0].position);
        this.dessinerLigne(point, distance);
      }
      this.scene.add(point);
      this.points.push(point);
      this.verifierCroisementLigne();
      this.redessinerCourbe();
      this.render();
    } else {
        alert('Dessin termine');
    }
  }

  public supprimerPoint() {
    this.dessinTermine = false;
    this.scene.remove(this.points[this.points.length - 1]);
    this.points.pop();
    this.scene.remove(this.lignes[this.lignes.length - 1]);
    this.lignes.pop();
    this.redessinerCourbe();
    if (this.compteur >= 1) {
      this.compteur--;
    }
    console.log('Il n\'est pas possible de créer des angles de pistes inférieurs à 45 degrés.  ' +
      'Veuillez proposer une autre section de parcours.');
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

    if (this.estUnAngleMoins45()) {
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
    /*alert('Il n\'est pas possible de créer des angles de pistes inférieurs à 45 degrés.  ' +
      'Veuillez proposer une autre section de parcours.');*/
    console.log('Il n\'est pas possible de créer des angles de pistes inférieurs à 45 degrés.  ' +
      'Veuillez proposer une autre section de parcours.');
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

  public retournerListePoints() {
    if (this.dessinTermine) {
      return this.points;
    }
  }

  public retournerListeLines() {
    if (this.dessinTermine) {
      return this.lignes;
    }
  }


  public retourneetatDessin() {
    return this.dessinTermine;
  }

  private segmentsCoises(pointA, pointB, pointC, pointD){

    const vectAB =  [pointB.position.x - pointA.position.x, pointB.position.y - pointA.position.y];
    const vectAC =  [pointC.position.x - pointA.position.x, pointC.position.y - pointA.position.y];
    const vectAD =  [pointD.position.x - pointA.position.x, pointD.position.y - pointA.position.y];
    const vectCA =  vectAC.map(function(x) { return x * -1;});
    const vectCB =  [pointB.position.x - pointC.position.x, pointB.position.y - pointC.position.y];
    const vectCD =  [pointD.position.x - pointC.position.x, pointD.position.y - pointC.position.y];

    const determinantABAC = vectAB[0] * vectAC[1] -  vectAB[1] * vectAC[0];
    const determinantABAD = vectAB[0] * vectAD[1] -  vectAB[1] * vectAD[0];
    const determinantCDCB = vectCD[0] * vectCB[1] -  vectCD[1] * vectCB[0];
    const determinantCDCA = vectCD[0] * vectCA[1] -  vectCD[1] * vectCA[0];

    //console.log(vectCA, vectCB, vectCD);
    console.log(determinantABAC, determinantABAD, determinantCDCB, determinantCDCA);


    if(Math.sign(determinantABAC) === 0 || Math.sign(determinantCDCB) === 0){
      return false;
    }else if (Math.sign(determinantABAC) !== Math.sign(determinantABAD) && Math.sign(determinantCDCB) !== Math.sign(determinantCDCA)){
      if(this.dessinTermine) {
        console.log('ici', vectAD);
        if( vectAD[0] === 0 && vectAD[1] === 0 ) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  private verifierCroisementLigne(){
    let ligneCroisees =  0;
    for (let i = 0 ; i < this.points.length ; i++){
      for (let j = i + 1 ; j < this.points.length - 1; j++){
        let pointA = this.points[i];
        let pointB = this.points[i + 1];
        let pointC = this.points[j];
        let pointD = this.points[j + 1];
        console.log(i,j, this.compteur);
        if(this.segmentsCoises(pointA, pointB, pointC, pointD )){
          console.log('croisé');
          ligneCroisees ++;
        }
      }
    }
    if (ligneCroisees > 0){
      alert(ligneCroisees + ' lignes croisées');
    }
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


  /**********************************************************
                Gestion des déplacements souris
   *********************************************************/

  public onMouseDown(event) {
    console.log(event);
    this.mouseDownTime = new Date().getTime();
    // console.log('mouseDown');
    if (this.pointHover) {
      this.dragMode = true;
      // console.log('dragMode');
    }
  }

  public onMouseUp(event) {
    this.mouseUpTime = new Date().getTime();
    const clicDuration = this.mouseUpTime - this.mouseDownTime;
    console.log('clic duration', clicDuration);
    if(event.button === 2){
      this.supprimerPoint();
    }else if (!this.dragMode || clicDuration < 500 && this.objectDragged.name === '0') {
      this.dessinerPoint(event);
    }else if (clicDuration < 500 && this.objectDragged.name === '0'){
      this.dessinerPoint(event);
    }
    this.dragMode = false;
  }

  public onMouseMove(event) {
    const rayCaster = new THREE.Raycaster();
    this.mouse = this.obtenirCoordonnees(event);
    let intersects;
    this.scene.updateMatrixWorld(true);
    rayCaster.setFromCamera(this.mouse, this.camera);
    intersects = rayCaster.intersectObjects(this.scene.children);

    if (this.dragMode) {
      this.dragPoint(intersects[0].point);
    } else {
      if (intersects.length > 0) {
        this.resetPointsColor();
        this.pointHover = false; // on désactive le hover
        for (const objet of intersects) {
          if (objet.object.type === 'Points') {
            this.hoverPoint(objet.object);
          }
        }
      }
    }
  }

  private dragPoint(position){
    this.objectDragged.position.copy(position);
    const objectDraggedNumber = parseInt (this.objectDragged.name);
    // this.modifierPointLine(objectDraggedNumber, this.objectDragged.position);
    this.redessinerCourbe();
    if(objectDraggedNumber === 0 && this.dessinTermine){ //On modifie aussi le dernier point
      this.points[this.compteur-1].position.copy(this.objectDragged.position);
      // this.modifierPointLine(this.compteur - 1, this.objectDragged.position);
    }
  }

  private hoverPoint(point){
    this.pointHover = true; // ici on informe qu'il y a un point sélectionné eet si on clique on passe en mode selection (drag)
    this.objectDragged = point;
    point.material.color.set(0x0000ff); // ici on change la couleur
    point.material.size = 11;
  }

  private resetPointsColor(){
    for (const point of this.points){
      point.material.color.set(point.material.normalColor);
      point.material.size = 5 ;
    }
  }

  /**********************************************************
          Gestion génération de la courbe
   *********************************************************/

  private dessinerCourbe(){
    let curve;
    const arrayPointPosition = [];
    for (const point of this.points){
      arrayPointPosition.push(point.position);
    }
    // Create a closed wavey loop

    if (this.dessinTermine){
      arrayPointPosition.pop();
    }
    curve = new THREE.CatmullRomCurve3(arrayPointPosition);
    curve.closed = this.dessinTermine;

    const geometry = new THREE.Geometry();
    geometry.vertices = curve.getPoints( 100 );

    const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

    // Create the final object to add to the scene
    this.courbe = new THREE.Line( geometry, material );
    this.scene.add(this.courbe);
  }

  private retirerCourbe(){
    this.scene.remove(this.courbe);
  }

  private redessinerCourbe(){
    if (this.courbe){
      this.retirerCourbe();
    }
    if (this.points.length > 2){
      this.dessinerCourbe();
    }
  }
}

