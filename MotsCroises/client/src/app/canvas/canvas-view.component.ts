import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';


@Component({
  selector: 'canvas-view-component',
  templateUrl: './canvas-view.component.html',
  styleUrls: ['./canvas-view.component.css']
})

export class CanvasViewComponent implements AfterViewInit {

  private canvas: any;
  private ctxCanvas: any;
  private largeurCase: number;
  private hauteurCase: number;
  private nbCases = 11;
  private couleurNoire = '#000000';
  private couleurRouge = '#DD0000'

  constructor() {
  }

  @ViewChild('canvasjeu')
  private containerRef: ElementRef;

  public obtenirCanvasJeu(): void {
    this.canvas = this.containerRef.nativeElement;
  }

  public ngAfterViewInit(): void {
    this.obtenirCanvasJeu();
    this.canvas.height = this.canvas.width;
    this.largeurCase = this.canvas.width / 11;
    this.hauteurCase = this.canvas.height / 11;
    this.ctxCanvas = this.canvas.getContext('2d');
    this.ctxCanvas.imageSmoothingEnabled = false;
    this.dessinerLignesGrille();
    this.afficherPositionMotSurCase(5, 1, 4, 3, '#0000DD');
    this.ecrireLettreDansCase('A', 4,3, this.couleurRouge);

  }

  public dessinerLignesGrille(){
    this.ctxCanvas.fillStyle = '#000000';
    for (let i = 1; i < this.nbCases; i++){
      this.ecrireLettreDansCase(i, i, 0, this.couleurNoire);
      this.ecrireLettreDansCase(i, 0, i, this.couleurNoire);
      this.ctxCanvas.fillRect(this.largeurCase * i, this.hauteurCase, 1, this.canvas.height);
      this.ctxCanvas.fillRect(this.largeurCase, this.hauteurCase * i, this.canvas.width, 1);
    }
    this.ctxCanvas.fillRect(this.largeurCase * this.nbCases - 1, this.hauteurCase, 1, this.canvas.height);
    this.ctxCanvas.fillRect(this.largeurCase, this.hauteurCase * this.nbCases - 1, this.canvas.width, 1);
    //this.ctxCanvas.fillRect(0, 0, 10, 10);
  }

  public ecrireChiffreGrille(){

  }

  public ecrireDansCase(i, j){

  }

  public afficherPositionMotSurCase(tailleMot, sens, i, j, couleur){
    this.ctxCanvas.strokeStyle = couleur;
    this.ctxCanvas.lineWidth = '3';
    this.ctxCanvas.setLineDash([5, 3]);
    if (sens === 0){
      this.ctxCanvas.rect(this.largeurCase * i, this.hauteurCase * j, this.largeurCase * tailleMot, this.hauteurCase);
      this.ctxCanvas.stroke();
    }else{
      this.ctxCanvas.rect(this.largeurCase * i, this.hauteurCase * j, this.largeurCase , this.hauteurCase * tailleMot);
      this.ctxCanvas.stroke();
    }
  }

  public ecrireLettreDansCase(lettre, i, j, couleur){
    this.ctxCanvas.font = '10px Arial';
    this.ctxCanvas.fillStyle = couleur;
    this.ctxCanvas.textAlign = 'center';
    this.ctxCanvas.textBaseline = 'middle';
    this.ctxCanvas.fillText(lettre, this.largeurCase * (i + 1 / 2) , this.hauteurCase * (j +1 / 2));
  }





}
