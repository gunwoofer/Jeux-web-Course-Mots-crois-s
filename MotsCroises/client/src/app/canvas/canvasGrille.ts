import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import {GameViewService} from '../game_view/game-view.service';
import {IndiceMot} from '../indice/indiceMot';
import {ElementRef} from '@angular/core';

export class CanvasGrille {
  private canvas: any;
  private ctxCanvas: any;
  private largeurCase: number;
  private hauteurCase: number;
  private margeEffacement: number;
  private nbCases = 11;
  private couleurNoire = '#000000';
  private couleurJoueur = '#2baa87';
  private policeLettres = '35px Arial';
  private ligneActuelle: number;
  private colonneActuelle: number;
  private specificationPartie: SpecificationPartie;
  public couleurJ1 = '#DD0000';
  public couleurJ2 = '#3366DD';
  public motEcrit = '';
  public indice: IndiceMot;
  public indiceAdversaire: IndiceMot;


  constructor(private gameViewService: GameViewService, containerRef: ElementRef) {
    this.obtenirCanvasJeu(containerRef);
    this.initialise();
  }

  public actionToucheAppuyee(event: KeyboardEvent) {
    const cleMot = event.key;
    const codeLettre = event.keyCode;
    if (!this.testIndiceSelectionne()) {
      alert('Selectionner  d\'abord un indice svp');
      return;
    }
    if (cleMot === 'Backspace') {
      if (this.motEcrit.length === 0) {
        return;
      }
      this.reculerCaseActive(this.indice.sens);
      this.motEcrit = this.motEcrit.substring(0, this.motEcrit.length - 1);
      this.effacerLettreDansCaseActive();
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
    this.gameViewService.mettreAJourMotEntre(this.motEcrit);
    this.validerMotEntre();
  }

  public miseAJourIndice(indice: IndiceMot) {
    this.motEcrit = '';
    this.indice = indice;
    this.definirCaseActive(indice.positionI, indice.positionJ);
    this.rafraichirCanvas();
  }

  public testIndiceSelectionne(): boolean {
    if (!this.indice) {
      return false;
    }
    return true;
  }

  public miseAJourIndiceAdversaire(indice: IndiceMot) {
    // this.motEcrit = '';
    this.indiceAdversaire = indice;
    console.log('mise a jour indice adversaire');
    // this.definirCaseActive(indice.positionI, indice.positionJ);
    this.rafraichirCanvas();
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
        this.ecrireMotDansGrille(i.motTrouve, i.sens, i.positionI, i.positionJ, i.couleur);
      }
    }
  }

  public obtenirCanvasJeu(containerRef: ElementRef): void {
    this.canvas = containerRef.nativeElement;
  }

  public initialise(): void {
    this.canvas.height = this.canvas.width;
    this.largeurCase = this.canvas.width / 11;
    this.hauteurCase = this.canvas.height / 11;
    this.margeEffacement = Math.round(this.largeurCase / 10);
    this.ctxCanvas = this.canvas.getContext('2d');
    this.dessinerLignesGrille();
    this.ecrireMotsTrouves();
    this.specificationPartie = this.gameViewService.getPartie();
    this.dessinerCaseNoiresGrilleObtenueServeur();
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
    this.ecrireMotsGrilleObtenueServeur();
    this.dessinerCaseNoiresGrilleObtenueServeur();
    this.ecrireMotsTrouves();
    if (this.indice) {
      this.ecrireMotDansGrille(this.motEcrit, this.indice.sens, this.indice.positionI, this.indice.positionJ, this.couleurJoueur);
    }
    this.gererAffichageSelecteurs();
  }

  public motTrouveRafraichirCanvas() {
    this.motEcrit = '';
    this.rafraichirCanvas();
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
    this.effacerLettreDansCase(i, j);
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

  private afficherSelecteurMotSurGrille(tailleMot: number, sens: number, i: number, j: number,
     couleur: string, ligneDash: boolean = false) {
    this.ctxCanvas.strokeStyle = couleur;
    this.ctxCanvas.lineWidth = '5';
    this.ctxCanvas.setLineDash([]);
    if (ligneDash) {
      this.ctxCanvas.setLineDash([20, 20]);
    }
    this.ctxCanvas.beginPath();
    if (sens === 0) {
      this.ctxCanvas.rect(this.largeurCase * i, this.hauteurCase * j, this.largeurCase * tailleMot, this.hauteurCase);
      this.ctxCanvas.stroke();
    } else {
      this.ctxCanvas.rect(this.largeurCase * i, this.hauteurCase * j, this.largeurCase, this.hauteurCase * tailleMot);
      this.ctxCanvas.stroke();
    }
  }

  private afficherSelecteurAdversaireSurGrille() {
    if (this.indiceAdversaire) {
      this.afficherSelecteurMotSurGrille(this.indiceAdversaire.tailleMot, this.indiceAdversaire.sens,
        this.indiceAdversaire.positionI, this.indiceAdversaire.positionJ, this.couleurJ2);
    }
  }

  private afficherDoubleSelecteur() {
    this.afficherSelecteurMotSurGrille(this.indiceAdversaire.tailleMot, this.indiceAdversaire.sens,
      this.indiceAdversaire.positionI, this.indiceAdversaire.positionJ, this.couleurJ1);
    this.afficherSelecteurMotSurGrille(this.indiceAdversaire.tailleMot, this.indiceAdversaire.sens,
      this.indiceAdversaire.positionI, this.indiceAdversaire.positionJ, this.couleurJ2, true);
  }

  private gererAffichageSelecteurs() {
    if (this.indice) {
      this.afficherSelecteurMotSurGrille(this.indice.tailleMot, this.indice.sens,
        this.indice.positionI, this.indice.positionJ, this.couleurJ1);
    }
    if (this.indiceAdversaire) {
      this.afficherSelecteurAdversaireSurGrille();
    } else {
      return;
    }
    if (this.indice && this.indiceAdversaire && this.indice.guidIndice === this.indiceAdversaire.guidIndice) {
      this.afficherDoubleSelecteur();
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
    this.rafraichirCanvas();
  }

  public testCaseDisponible(i: number, j: number) {
    if (this.indice.sens === 0) {
      return i < this.indice.positionI + this.indice.tailleMot;
    } else {
      return j < this.indice.positionJ + this.indice.tailleMot;
    }
  }

  public dessinerCaseNoiresGrilleObtenueServeur() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (this.specificationPartie.specificationGrilleEnCours.cases.obtenirLigneCases(i)[j].obtenirEtat() === 2) {
          this.dessinerRectangleNoir(j + 1, i + 1);
        }
      }
    }
  }

  public ecrireMotsGrilleObtenueServeur() {
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.ecrireLettreDansCase(
          this.specificationPartie.specificationGrilleEnCours.cases.obtenirLigneCases(i)[j].obtenirLettre(),
          j + 1, i + 1, this.couleurJ1
        );
      }
    }
  }
}
