import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {GameViewService} from '../game_view/game-view.service';
import {CanvasGrille} from './canvasGrille';


@Component({
  selector: 'app-canvas-view-component',
  templateUrl: './canvas-view.component.html',
  styleUrls: ['./canvas-view.component.css'],
})

export class CanvasViewComponent implements AfterViewInit {
  private   canvasGrille: CanvasGrille;

  constructor(private gameViewService: GameViewService) {
    this.souscrireEvenementIndices();
  }

  @ViewChild('canvasjeu')
  private containerRef: ElementRef;

  @HostListener('document:keyup', ['$event'])
  public onKeyUp(ev: KeyboardEvent) {
    this.canvasGrille.actionToucheAppuyee(ev);
  }

  public ngAfterViewInit(): void {
    this.canvasGrille = new CanvasGrille(this.gameViewService, this.containerRef);
  }

  public motTrouveActualiser(): void {
    if (this.canvasGrille) {
      this.canvasGrille.motTrouveRafraichirCanvas();
    }
  }

  private souscrireEvenementIndices() {
    this.gameViewService.indiceSelectionne$.subscribe(indice => {
      if (!indice) {
        this.canvasGrille.initialise();
        this.canvasGrille.miseAJourIndice(null);
        return;
      }
      this.canvasGrille.miseAJourIndice(indice);
    });
    this.gameViewService.indiceAdversaireSelectionne$.subscribe(indice => {
      if (!indice) {
        this.canvasGrille.initialise();
        return;
      }
      this.canvasGrille.miseAJourIndiceAdversaire(indice);
    });
  }

}
