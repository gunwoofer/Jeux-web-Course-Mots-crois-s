import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {IndiceViewService} from '../indice/indice-view.service';
import {GameViewService} from '../game_view/game-view.service';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import {IndiceMot} from '../indice/indiceMot';


@Component({
  selector: 'app-canvas-view-component',
  templateUrl: './canvas-view.component.html',
  styleUrls: ['./canvas-view.component.css'],
})

export class CanvasViewComponent implements AfterViewInit {

  private canvas: any;
  private ctxCanvas: any;
  private largeurCase: number;
  private hauteurCase: number;
  private margeEffacement: number;
  private nbCases = 11;
  private couleurNoire = '#000000';
  private couleurRouge = '#DD0000';
  private couleurJoueur = '#2baa87';
  private couleurMotTrouve = '#3665aa';
  private policeLettres = '35px Arial';
  private ligneActuelle: number;
  private colonneActuelle: number;
  private motEcrit = '';
  private indice: IndiceMot;
  private specificationPartie: SpecificationPartie;

  constructor(private indiceViewService: IndiceViewService, private gameViewService: GameViewService) {
    this.indiceViewService.indiceSelectionneL.subscribe(indice => {
      if (!indice) {
        this.rafraichirCanvas();
        return;
      }
      this.motEcrit = '';
      this.indice = indice;
      this.definirCaseActive(indice.positionI, indice.positionJ);
      this.rafraichirCanvas();
      this.afficherSelecteurMotSurGrille(indice.tailleMot, indice.sens, indice.positionI, indice.positionJ, this.couleurRouge);
    });

  }

  @ViewChild('canvasjeu')
  private containerRef: ElementRef;

  @HostListener('document:keyup', ['$event'])
  public onKeyUp(ev: KeyboardEvent) {
    this.actionToucheAppuyee(ev);
  }

  public actionToucheAppuyee(event: KeyboardEvent) {
    const cleMot = event.key;
    const codeLettre = event.keyCode;
    if (cleMot === 'Backspace') {
      if (this.motEcrit.length === 0) {
        return;
      }
      this.reculerCaseActive(this.indice.sens);
      this.effacerLettreDansCaseActive();
      this.motEcrit = this.motEcrit.substring(0, this.motEcrit.length - 1);
    } else {
      if (!this.testCaseDisponible(this.ligneActuelle, this.colonneActuelle)) {
        alert('taille maximale du mot atteinte');
        return;
      } else if (codeLettre < 65 || (codeLettre > 91 && codeLettre < 97) || codeLettre > 123) {
        alert('touche non valide');
        return;
      }
      this.motEcrit = this.motEcrit + cleMot.toUpperCase();
      this.ecrireLettreDansCaseActive(cleMot.toUpperCase(), this.couleurJoueur);
      this.avancerCaseActive(this.indice.sens);
    }
    this.indiceViewService.mettreAJourMotEntre(this.motEcrit);
    this.validerMotEntre();
  }

  public validerMotEntre() {
    if (this.motEcrit.length === this.indice.tailleMot) {
      this.gameViewService.testMotEntre(this.motEcrit, this.indice);
      this.ecrireMotsTrouves();
    }
  }

  public ecrireMotsTrouves() {
    for (const i of this.gameViewService.indices) {
      if (i.motTrouve.length > 0) {
        this.ecrireMotDansGrille(i.motTrouve, i.sens, i.positionI, i.positionJ, this.couleurMotTrouve);
      }
    }
  }

  public obtenirCanvasJeu(): void {
    this.canvas = this.containerRef.nativeElement;
  }

  public ngAfterViewInit(): void {
    this.obtenirCanvasJeu();
    this.canvas.height = this.canvas.width;
    this.largeurCase = this.canvas.width / 11;
    this.hauteurCase = this.canvas.height / 11;
    this.margeEffacement = Math.round(this.largeurCase / 10);
    this.ctxCanvas = this.canvas.getContext('2d');
    this.dessinerLignesGrille();
    this.ecrireMotsTrouves();
    this.specificationPartie = this.gameViewService.getPartie();
    this.testCaseNoiresMotsGrilleObtenueServeur();
  }

  public dessinerLignesGrille() {
    this.ctxCanvas.fillStyle = '#000000';
    for (let i = 1; i < this.nbCases; i++) {
      this.ecrireLettreDansCase(i.toString(), i, 0, this.couleurNoire);
      this.ecrireLettreDansCase(i.toString(), 0, i, this.couleurNoire);
      this.ctxCanvas.fillRect(this.largeurCase * i, this.hauteurCase, 1, this.canvas.height);
      this.ctxCanvas.fillRect(this.largeurCase, this.hauteurCase * i, this.canvas.width, 1);
    }
    this.ctxCanvas.fillRect(this.largeurCase * this.nbCases - 1, this.hauteurCase, 1, this.canvas.height);
    this.ctxCanvas.fillRect(this.largeurCase, this.hauteurCase * this.nbCases - 1, this.canvas.width, 1);
  }

  public rafraichirCanvas() {
    this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.dessinerLignesGrille();
    this.ngAfterViewInit();
    this.testEcrireMotsGrilleObtenueServeur();
    this.testCaseNoiresMotsGrilleObtenueServeur();
    this.ecrireMotsTrouves();
  }

  public ecrireMotDansGrille(mot: string, sens: number, i: number, j: number, couleur: string) {
    if (sens === 0) {
      for (let u = 0; u < mot.length; u++) {
        this.ecrireLettreDansCase(mot.charAt(u), i + u, j, couleur);
      }
    } else {
      for (let v = 0; v < mot.length; v++) {
        this.ecrireLettreDansCase(mot.charAt(v), i, j + v, couleur);
      }
    }
  }

  public ecrireLettreDansCase(lettre: string, i: number, j: number, couleur: string) {
    this.ctxCanvas.font = this.policeLettres;
    this.ctxCanvas.fillStyle = couleur;
    this.ctxCanvas.textAlign = 'center';
    this.ctxCanvas.textBaseline = 'middle';
    this.ctxCanvas.fillText(lettre.toUpperCase(), this.largeurCase * (i + 1 / 2), this.hauteurCase * (j + 1 / 2));
  }

  public dessinerRectangleNoir(i: number, j: number) {
    this.ctxCanvas.fillStyle = this.couleurNoire;
    this.ctxCanvas.fillRect(this.largeurCase * i, this.hauteurCase * j, this.largeurCase, this.largeurCase);
  }

  public afficherSelecteurMotSurGrille(tailleMot: number, sens: number, i: number, j: number, couleur: string) {
    this.ctxCanvas.strokeStyle = couleur;
    this.ctxCanvas.lineWidth = '5';
    this.ctxCanvas.setLineDash([10, 10]);
    this.ctxCanvas.beginPath();
    if (sens === 0) {
      this.ctxCanvas.rect(this.largeurCase * i, this.hauteurCase * j, this.largeurCase * tailleMot, this.hauteurCase);
      this.ctxCanvas.stroke();
    } else {
      this.ctxCanvas.rect(this.largeurCase * i, this.hauteurCase * j, this.largeurCase, this.hauteurCase * tailleMot);
      this.ctxCanvas.stroke();
    }
  }

  public ecrireLettreDansCaseActive(lettre: string, couleur: string) {
    this.ecrireLettreDansCase(lettre, this.ligneActuelle, this.colonneActuelle, couleur);
  }


  public definirCaseActive(i: number, j: number) {
    this.ligneActuelle = i;
    this.colonneActuelle = j;
  }

  public avancerCaseActive(sens) {
    sens === 0 ? this.ligneActuelle++ : this.colonneActuelle++;
  }

  public reculerCaseActive(sens) {
    sens === 0 ? this.ligneActuelle-- : this.colonneActuelle--;
  }

  public effacerLettreDansCase(i: number, j: number) {
    this.ctxCanvas.clearRect(this.largeurCase * i + this.margeEffacement, this.hauteurCase * j + this.margeEffacement,
      this.largeurCase - 2 * this.margeEffacement, this.hauteurCase - 2 * this.margeEffacement);
  }

  public effacerLettreDansCaseActive() {
    this.effacerLettreDansCase(this.ligneActuelle, this.colonneActuelle);
  }

  public testCaseDisponible(i: number, j: number) {
    if (this.indice.sens === 0) {
      return i < this.indice.positionI + this.indice.tailleMot;
    } else {
      return j < this.indice.positionJ + this.indice.tailleMot;
    }
  }

  public testCaseNoiresMotsGrilleObtenueServeur() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.specificationPartie.specificationGrilleEnCours.cases.obtenirLigneCases(i)[j].obtenirEtat() === 2) {
          this.dessinerRectangleNoir(j + 1, i + 1);
        }
      }
    }
  }

  public testEcrireMotsGrilleObtenueServeur() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.ecrireLettreDansCase(
          this.specificationPartie.specificationGrilleEnCours.cases.obtenirLigneCases(i)[j].obtenirLettre(),
          j + 1, i + 1, this.couleurRouge
        );
      }
    }
  }
}