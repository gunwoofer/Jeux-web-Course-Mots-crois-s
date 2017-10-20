import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {IndiceViewService} from '../indice/indice-view.service';
import {GameViewService} from '../game_view/game-view.service';
import {CanvasGrille} from './canvasGrille';


@Component({
  selector: 'app-canvas-view-component',
  templateUrl: './canvas-view.component.html',
  styleUrls: ['./canvas-view.component.css'],
})

export class CanvasViewComponent implements AfterViewInit {
  private canvasGrille: CanvasGrille;

  constructor(private indiceViewService: IndiceViewService, private gameViewService: GameViewService) {
    this.indiceViewService.indiceSelectionneL.subscribe(indice => {
      if (!indice) {
        this.canvasGrille.initialise();
        return;
      }
      this.canvasGrille.miseAJourIndice(indice);
    });
  }

  @ViewChild('canvasjeu')
  private containerRef: ElementRef;

  @HostListener('document:keyup', ['$event'])
  public onKeyUp(ev: KeyboardEvent) {
    this.canvasGrille.actionToucheAppuyee(ev);
  }

  public ngAfterViewInit(): void {
    this.canvasGrille = new CanvasGrille(this.gameViewService, this.indiceViewService, this.containerRef);
  }

  public motTrouveActualiser(): void {
    this.canvasGrille.motTrouveRafraichirCanvas();
  }

}
