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
  private points: any [] = []; // tableau de points
  private lignes: any [] = []; // tableau de lignes

  private pointXVecteur: number[] = [];
  private pointYVecteur: number[] = [];
  private dessinTermine = false;
  private cameraZ = 400;
  private nearClippingPane = 1;
  private farClippingPane = 1000;
  public rotationSpeedX = 0.005;
  public rotationSpeedY = 0.01;
  private compteur = 0;
  private normeSegment = 0;


  private mouseDownTime;
  private mouseUpTime;
  private dragMode;
  private pointHover;
  private objectDragged;

  private pointsLine;
  private compteurPoints = 0;
  private courbe;

  private nbSegmentsCroises = 0;
  private nbAnglesPlusPetit45 = 0;
  private nbSegmentsTropProche = 0;


  private listeErreurCouleur = {
    normal : 'green',
    angle45 : 'red',
    proche : 'orange'
  };

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
    point.name = '' + this.compteurPoints;
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
    // this.scene.add(ligne); // pour utiliser les lignes séparés, il faut les update toutes
    this.compteur++;
  }

  /*
  // fonction à appeler dans dragPoint pour actualiser les lignes quand on utilise le tableau de lignes
  private miseAJourLignes(){
    for (const ligne of this.lignes){
      ligne.geometry.verticesNeedUpdate = true;
    }
  }*/

  // Dessin des points
  public dessinerPoint(event) {
    console.log('dessinPOint');
    let objet, point;
    if (!this.dessinTermine) {
      objet = this.obtenirIntersection(event);
      point = this.creerPoint(objet.point, 'black');
      point.material.normalColor = 'black';
      point.material.status = 'normal';
      if (this.points.length > 0) {
        point.material.color.set('green');
        point.material.normalColor = 'green';
        const distance = point.position.distanceTo(this.points[0].position);
        this.dessinerLigne(point, distance);
      }
      if (!this.dessinTermine ) {
        this.scene.add(point);
      }
      this.compteurPoints++;
      this.ajouterPointLine(point.position);
      this.points.push(point);
      this.restaurerStatusPoints();
      this.nombreLignesCroisees();
      this.nombreSegmentsTropCourts();
      this.nombreAnglesMoins45();
      this.actualiserCouleurPoints();
      this.redessinerCourbe();
      this.render();
    } else {
        alert('Dessin termine');
    }
  }

  public afficherMessageErreurs(messages?: string) {
    let message: string;
    if (this.nbAnglesPlusPetit45 > 0) {
      message = 'Il y a : ' + this.nbAnglesPlusPetit45 + ' angle(s) plus petit(s) que 45 degrés (en rouge).'
      + ' Veuillez corriger les erreursCircuit pour valider la piste.';
    }
    if (this.nbSegmentsTropProche > 0) {
      message = 'Il y a : ' + this.nbSegmentsTropProche + ' segment(s) trop proche(s) (en orange).'
      + ' Veuillez corriger les erreursCircuit pour valider la piste.';
    }
    if (this.nbSegmentsCroises > 0) {
      message = 'Il y a : ' + this.nbSegmentsCroises + ' segment(s) croisé(s). Veuillez corriger les erreursCircuit pour valider la piste.';
    }
    if (this.nbAnglesPlusPetit45 > 0 && this.nbSegmentsTropProche > 0) {
      message = 'Il y a : ' + this.nbAnglesPlusPetit45 + ' angle(s) plus petit(s) que 45 degrés (en rouge) et '
      + this.nbSegmentsTropProche + ' segment(s) trop proche(s) (en orange). Veuillez corriger les erreursCircuit pour valider la piste.';
    }
    if (this.nbAnglesPlusPetit45 > 0 && this.nbSegmentsCroises > 0) {
      message = 'Il y a : ' + this.nbAnglesPlusPetit45 + ' angle(s) plus petit(s) que 45 degrés (en rouge) et '
      + this.nbSegmentsCroises + ' segment(s) croisé(s). ' + 'Veuillez corriger les erreursCircuit pour valider la piste.';
    }
    if (this.nbSegmentsTropProche > 0 && this.nbSegmentsCroises > 0) {
      message = 'Il y a : ' + this.nbSegmentsTropProche + ' segment(s) trop proche(s) (en orange) et '
        + this.nbSegmentsCroises + ' segment(s) croisé(s). Veuillez corriger les erreursCircuit pour valider la piste.';
    }
    if (this.nbAnglesPlusPetit45 > 0 && this.nbSegmentsTropProche > 0 && this.nbSegmentsCroises > 0) {
      message = 'Il y a : ' + this.nbAnglesPlusPetit45 + ' angle(s) plus petit(s) que 45 degrés (en rouge), '
        + this.nbSegmentsTropProche + ' segment(s) trop proche(s) (en orange) et '
        + this.nbSegmentsCroises + ' segment(s) croisé(s). Veuillez corriger les erreursCircuit pour valider la piste.';
    }
    return message;
  }

  public supprimerPoint() {
    this.dessinTermine = false;
    this.scene.remove(this.points[this.points.length - 1]);
    this.points.pop();
    this.scene.remove(this.lignes[this.lignes.length - 1]);
    this.lignes.pop();
    this.redessinerCourbe();
    this.retirerAncienPointLine();
    if (this.compteur >= 1) {
      this.compteur--;
      this.compteurPoints--;
    }
  }

  public obtenirCoordonnees(event) {

    event.preventDefault();
    const rectangle = this.renderer.domElement.getBoundingClientRect();
    const vector = new THREE.Vector2();
    vector.x = ((event.clientX - rectangle.left) / (rectangle.right - rectangle.left)) * 2 - 1;
    vector.y = - ((event.clientY - rectangle.top) / (rectangle.bottom - rectangle.top)) * 2 + 1;
    return new THREE.Vector2(vector.x, vector.y);

  }


  private nombreAnglesMoins45() {
    let nbAnglesMoins45 = 0;
    for (let i = 1;  i < this.points.length - 1 ; i++) {
      if (this.estUnAngleMoins45(i)) {
        nbAnglesMoins45 ++;
      }
    }
    if (this.dessinTermine) {
      if (this.estUnAngleMoins45(0)) {
        nbAnglesMoins45 ++;
      }
    }
    this.nbAnglesPlusPetit45 = nbAnglesMoins45;
  }

  private estUnAngleMoins45(numeroPoint: number) {
    if (this.points.length > 1) {
      const angle = this.calculerAngle(numeroPoint);
      if (angle <= 0.785398163) {
        this.points[numeroPoint].material.status = 'angle45';
        return true;
      }
    }
    return false;
  }

  public calculerAngle(numeroPoint: number) {

   if (this.points.length > 1 ) {

      const point1 = this.points[numeroPoint === 0 ? this.compteur - 1 : numeroPoint - 1];
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


  public creerScene() {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFFFFF);
    /* Camera */
    const aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    this.camera.position.z = 100;
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
    if (this.nbAnglesPlusPetit45 + this.nbSegmentsCroises + this.nbSegmentsTropProche === 0) {
      return this.dessinTermine;
    }else {
      return false;
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
    this.creerLignePoints();
    this.startRenderingLoop();
  }

  /**********************************************************
                   Gestion longueur segment
   *********************************************************/
  private nombreSegmentsTropCourts() {
    const largeurPiste = 10;
    let segmentTropCourt = 0;
    for (let i = 0; i < this.points.length - 1 ; i ++) {
      const tailleSegment = this.points[i].position.distanceTo(this.points[i + 1].position);
      if (tailleSegment < 2 * largeurPiste) {
        segmentTropCourt ++;
        this.points[i].material.status = 'proche';
        this.points[i + 1].material.status = 'proche';
      }
    }
    this.nbSegmentsTropProche = segmentTropCourt;
  }


  /**********************************************************
                  Gestion croisements
   *********************************************************/
  private segmentsCoises(pointA, pointB, pointC, pointD) {

    const vectAB =  [pointB.position.x - pointA.position.x, pointB.position.y - pointA.position.y];
    const vectAC =  [pointC.position.x - pointA.position.x, pointC.position.y - pointA.position.y];
    const vectAD =  [pointD.position.x - pointA.position.x, pointD.position.y - pointA.position.y];
    const vectCA =  vectAC.map(function(x) { return x * -1; });
    const vectCB =  [pointB.position.x - pointC.position.x, pointB.position.y - pointC.position.y];
    const vectCD =  [pointD.position.x - pointC.position.x, pointD.position.y - pointC.position.y];

    const determinantABAC = vectAB[0] * vectAC[1] -  vectAB[1] * vectAC[0];
    const determinantABAD = vectAB[0] * vectAD[1] -  vectAB[1] * vectAD[0];
    const determinantCDCB = vectCD[0] * vectCB[1] -  vectCD[1] * vectCB[0];
    const determinantCDCA = vectCD[0] * vectCA[1] -  vectCD[1] * vectCA[0];

    if (Math.sign(determinantABAC) === 0 || Math.sign(determinantCDCB) === 0) {
      return false;
    }else if (Math.sign(determinantABAC) !== Math.sign(determinantABAD) && Math.sign(determinantCDCB) !== Math.sign(determinantCDCA)) {
      if (this.dessinTermine) {
        if ( vectAD[0] === 0 && vectAD[1] === 0 ) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  private nombreLignesCroisees() {
    let nbSegmentsCroises =  0;
    for (let i = 0 ; i < this.points.length ; i++) {
      for (let j = i + 1 ; j < this.points.length - 1; j++) {
        const pointA = this.points[i];
        const pointB = this.points[i + 1];
        const pointC = this.points[j];
        const pointD = this.points[j + 1];
        if (this.segmentsCoises(pointA, pointB, pointC, pointD )) {
          nbSegmentsCroises ++;
        }
      }
    }
    this.nbSegmentsCroises = nbSegmentsCroises;
  }


  /**********************************************************
                Gestion des déplacements souris
   *********************************************************/

  public onMouseDown(event) {
    if (event.button === 2) {
      event.preventDefault();
    }
    this.mouseDownTime = new Date().getTime();
    if (this.pointHover) {
      this.dragMode = true;
    }
  }

  public onMouseUp(event) {
    this.mouseUpTime = new Date().getTime();
    const clicDuration = this.mouseUpTime - this.mouseDownTime;
    if (event.button === 2) {
      this.supprimerPoint();
    }else if (!this.dragMode || clicDuration < 1000 && this.objectDragged.name === '0') {
      this.dessinerPoint(event);
    }else if (clicDuration < 500 && this.objectDragged.name === '0') {
      this.dessinerPoint(event);
    }else if (this.dragMode) {
      this.restaurerStatusPoints();
      this.nombreLignesCroisees();
      this.nombreSegmentsTropCourts();
      this.nombreAnglesMoins45();
      this.actualiserCouleurPoints();
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
        this.actualiserCouleurPoints();
        this.pointHover = false; // on désactive le hover
        for (const objet of intersects) {
          if (objet.object.type === 'Points') {
            this.hoverPoint(objet.object);
          }
        }
      }
    }
  }

  private dragPoint(position) {
    this.objectDragged.position.copy(position);
    const objectDraggedNumber = parseInt(this.objectDragged.name);
    this.modifierPointLine(objectDraggedNumber, this.objectDragged.position);
    this.redessinerCourbe();
    // this.miseAJourLignes();

    if (objectDraggedNumber === 0 && this.dessinTermine) { // On modifie aussi le dernier point
      this.points[this.compteur].position.copy(this.objectDragged.position);
      this.modifierPointLine(this.compteur, this.objectDragged.position);
    }
  }

  private hoverPoint(point) {
    this.pointHover = true; // ici on informe qu'il y a un point sélectionné eet si on clique on passe en mode selection (drag)
    this.objectDragged = point;
    point.material.color.set(0x0000ff); // ici on change la couleur
    point.material.size = 11;
  }

  private actualiserCouleurPoints() {
    for (const point of this.points){
      point.material.color.set(this.listeErreurCouleur[point.material.status]);
      point.material.size = 5 ;
    }
  }

  private restaurerStatusPoints() {
    for (const point of this.points){
      point.material.status = 'normal';
    }
  }

  /**********************************************************
       Gestion génération des droites reliant points
   *********************************************************/

  private creerLignePoints() {
    const MAX_POINTS = 500;
    const geometry = new THREE.BufferGeometry();

    // attributes
    const positions = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
    const colors = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    // draw range
    const drawCount = 2; // draw the first 2 points, only
    geometry.setDrawRange( 0, 0 );

    const material = new THREE.LineBasicMaterial({vertexColors: THREE.VertexColors });
    this.pointsLine = new THREE.Line(geometry, material);
    this.scene.add(this.pointsLine);
  }

  private modifierPointLine(positionTableauPoints, positionPoint) {
    const pointsLinePosition = this.pointsLine.geometry.attributes.position.array;
    pointsLinePosition[positionTableauPoints * 3] = positionPoint.x;
    pointsLinePosition[positionTableauPoints * 3 + 1] = positionPoint.y;
    pointsLinePosition[positionTableauPoints * 3 + 2] = positionPoint.z;
    this.pointsLine.geometry.attributes.position.needsUpdate = true;

  }

  private ajouterPointLine(positionNouveauPoint) {
    this.modifierPointLine(this.compteur, positionNouveauPoint);
    this.pointsLine.geometry.setDrawRange( 0, this.compteur + 1 );
  }

  private retirerAncienPointLine() {
    this.modifierPointLine(this.compteur, new THREE.Vector3(0, 0, 0));
    this.pointsLine.geometry.setDrawRange( 0, this.compteur );
  }


  /**********************************************************
          Gestion génération de la courbe
   *********************************************************/

  private dessinerCourbe() {
    let curve;
    const arrayPointPosition = [];
    for (const point of this.points){
      arrayPointPosition.push(point.position);
    }
    // Create a closed wavey loop

    if (this.dessinTermine) {
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

  private retirerCourbe() {
    this.scene.remove(this.courbe);
  }

  private redessinerCourbe() {
    if (this.courbe) {
      this.retirerCourbe();
    }
    if (this.points.length > 2) {
      this.dessinerCourbe();
    }
  }

  public obtenirScene() {
    return this.scene;
  }
}

