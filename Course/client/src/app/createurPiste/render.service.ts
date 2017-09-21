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
  public scene: THREE.Scene;
  private mouse: THREE.Vector2;
  public points = [];

  private pointXVecteur: number[] = [];
  private pointYVecteur: number[] = [];
  public dessinTermine = false;
  private cameraZ = 400;
  public compteur = 0;
  private normeSegment = 0;


  private tempsMouseDown;
  private tempsMouseUp;
  private dureeClick;
  private modeGlissement;
  private pointHover;
  private objetGlisse;

  public pointsLine;
  private courbe;
  private POINTS_MAXIMUM = 1000;

  private nbSegmentsCroises = 0;
  public nbAnglesPlusPetit45 = 0;
  private nbSegmentsTropProche = 0;


  private listeErreurCouleur = {
    normal: 'green',
    angle45: 'red',
    proche: 'orange',
    premier: 'purple'
  };

  public initialize(container: HTMLDivElement): void {
    this.container = container;
    this.creerScene();
    this.creerPlan();
    this.initStats();
    this.creerLignePoints();
    this.startRenderingLoop();
  }

  public obtenirLigneDeDepart(): number {
    if (this.pointsLine.geometry.attributes.position.array.length > 0) {
      return this.pointsLine.geometry.attributes.position.array[0];
    } else {
      return null;
    }
  }

  public obtenirIntersection(event): THREE.Intersection {
    const rayCaster = new THREE.Raycaster();
    this.mouse = this.obtenirCoordonnees(event);
    rayCaster.setFromCamera(this.mouse, this.camera);
    const intersection = rayCaster.intersectObjects(this.scene.children);
    return intersection[0];
  }


  /**********************************************************
                     Gestion Point
   *********************************************************/

  // Creation d'un point
  public creerPoint(coordonnees: THREE.Vector3, couleur: string): THREE.Points {
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

  // Dessin des points
  public dessinerPoint(event): number {
    let objet, point;
    if (!this.dessinTermine) {
      objet = this.obtenirIntersection(event);
      point = this.creerPoint(objet.point, 'black');
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

  public ajouterPoint(point): void {
    if (!this.dessinTermine) {
      this.scene.add(point);
    }
    this.ajouterPointLine(point.position);
    this.points.push(point);
    this.compteur++;
  }

  public supprimerPoint(): void {
    this.dessinTermine = false;
    this.scene.remove(this.points[this.points.length - 1]);
    this.points.pop();
    this.actualiserDonnees();
    this.redessinerCourbe();
    this.retirerAncienPointLine();
    if (this.compteur >= 1) {
      this.compteur--;
    }
  }

  private actualiserCouleurPoints(): void {
    for (const point of this.points) {
      point.material.color.set(this.listeErreurCouleur[point.material.status]);
      point.material.size = 5;
    }
  }

  private restaurerStatusPoints(): void {
    for (let i = 1; i < this.points.length; i++) {
      this.points[i].material.status = 'normal';
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



  /**********************************************************
                     Fonctions initialisation
   *********************************************************/
  public creerScene(): void {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xFFFFFF);
    /* Camera */
    this.camera = new THREE.PerspectiveCamera(75, this.getAspectRatio(), 1, 10000);
    this.camera.position.z = 100;
  }

  // Creation d'un plan
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

  public obtenirCoordonnees(event): THREE.Vector2 {
    event.preventDefault();
    const rectangle = this.renderer.domElement.getBoundingClientRect();
    const vector = new THREE.Vector2();
    vector.x = ((event.clientX - rectangle.left) / (rectangle.right - rectangle.left)) * 2 - 1;
    vector.y = - ((event.clientY - rectangle.top) / (rectangle.bottom - rectangle.top)) * 2 + 1;
    return new THREE.Vector2(vector.x, vector.y);
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
  private nombreSegmentsTropCourts(): void {
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


  /**********************************************************
                Gestion des déplacements souris
   *********************************************************/

  public onMouseDown(event): void {
    this.tempsMouseDown = new Date().getTime();
    if (this.pointHover) {
      this.modeGlissement = true;
    }
  }

  public onMouseClick(event): void {
    if (!this.modeGlissement || this.dureeClick < 500 && this.objetGlisse && this.objetGlisse.name === '0') {
      this.dessinerPoint(event);
    }
    this.modeGlissement = false;
  }

  public rightClick(): void {
    this.supprimerPoint();
    this.modeGlissement = false;
  }

  public onMouseUp(event): void {
    this.tempsMouseUp = new Date().getTime();
    this.dureeClick = this.tempsMouseUp - this.tempsMouseDown;
    if (event.button === 0) {
      if (this.modeGlissement) {
        this.actualiserDonnees();
      }
    }
  }

  public onMouseMove(event): void {
    const rayCaster = new THREE.Raycaster();
    this.mouse = this.obtenirCoordonnees(event);
    let intersects;
    this.scene.updateMatrixWorld(true);
    rayCaster.setFromCamera(this.mouse, this.camera);
    intersects = rayCaster.intersectObjects(this.scene.children);

    if (this.modeGlissement) {
      this.dragPoint(intersects[0].point);
    } else {
      if (intersects.length > 0) {
        this.actualiserCouleurPoints();
        this.pointHover = false;
        for (const objet of intersects) {
          if (objet.object.type === 'Points') {
            this.hoverPoint(objet.object);
          }
        }
      }
    }
  }

  private dragPoint(position): void {
    this.objetGlisse.position.copy(position);
    const objetGlisseNumber = parseInt(this.objetGlisse.name, 10);
    this.modifierPointLine(objetGlisseNumber, this.objetGlisse.position);
    this.redessinerCourbe();

    if (objetGlisseNumber === 0 && this.dessinTermine) { // On modifie aussi le dernier point
      this.points[this.compteur - 1].position.copy(this.objetGlisse.position);
      this.modifierPointLine(this.compteur - 1, this.objetGlisse.position);
    }
  }

  private hoverPoint(point): void {
    this.pointHover = true; // ici on informe qu'il y a un point sélectionné eet si on clique on passe en mode selection (drag)
    this.objetGlisse = point;
    point.material.color.set(0x0000ff); // ici on change la couleur
    point.material.size = 11;
  }


  private actualiserDonnees(): void {
    this.restaurerStatusPoints();
    this.nombreLignesCroisees();
    this.nombreSegmentsTropCourts();
    this.nombreAnglesMoins45();
    this.actualiserCouleurPoints();
  }

  /**********************************************************
       Gestion génération des droites reliant points
   *********************************************************/

  private creerLignePoints(): void {

    const geometrie = new THREE.BufferGeometry();
    const positions = new Float32Array(this.POINTS_MAXIMUM * 3);
    const colors = new Float32Array(this.POINTS_MAXIMUM * 3);
    geometrie.addAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometrie.addAttribute('color', new THREE.BufferAttribute(colors, 3));

    const nombreTirage = 2;
    geometrie.setDrawRange(0, 0);

    const materiel = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
    this.pointsLine = new THREE.Line(geometrie, materiel);
    this.scene.add(this.pointsLine);
  }

  private modificationdecouleuur(position): void {
    const couleurListe = this.pointsLine.geometry.attributes.color.array;
    const couleur = new THREE.Color(0x4fc3f7);
    if (this.points.length < 2) {
      couleurListe[position * 3] = couleur.r;
      couleurListe[position * 3 + 1] = couleur.g;
      couleurListe[position * 3 + 2] = couleur.b;
    }
    this.pointsLine.geometry.attributes.color.needsUpdate = true;
  }

  private modifierPointLine(positionTableauPoints, positionPoint): void {
    const pointsLinePosition = this.pointsLine.geometry.attributes.position.array;
    this.modificationdecouleuur(positionTableauPoints);
    pointsLinePosition[positionTableauPoints * 3] = positionPoint.x;
    pointsLinePosition[positionTableauPoints * 3 + 1] = positionPoint.y;
    pointsLinePosition[positionTableauPoints * 3 + 2] = positionPoint.z;

    this.pointsLine.geometry.attributes.position.needsUpdate = true;

  }

  private ajouterPointLine(positionNouveauPoint): void {
    this.modifierPointLine(this.compteur, positionNouveauPoint);
    this.pointsLine.geometry.setDrawRange(0, this.compteur + 1);
  }

  private retirerAncienPointLine(): void {
    this.modifierPointLine(this.compteur - 1, new THREE.Vector3(0, 0, 0));
    this.pointsLine.geometry.setDrawRange(0, this.compteur - 1);
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

  private redessinerCourbe(): void {
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
}

