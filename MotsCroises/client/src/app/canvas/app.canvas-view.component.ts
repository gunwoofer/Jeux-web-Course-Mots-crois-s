import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {GameViewService} from '../game_view/game-view.service';
import {CanvasService} from './canvasService';
import {TimerService} from '../game_view/timer.service';
import {IndiceService} from '../game_view/indice.service';


@Component({
    selector: 'app-canvas-view-component',
    templateUrl: './canvas-view.component.html',
    styleUrls: ['./canvas-view.component.css'],
})

export class CanvasViewComponent implements AfterViewInit {
    private canvasGrille: CanvasService;

    constructor(private gameViewService: GameViewService,
                private timerService: TimerService,
                private indiceService: IndiceService) {
        this.souscrireEvenementIndices();
    }

    @ViewChild('canvasjeu')
    private containerRef: ElementRef;

    @HostListener('document:keyup', ['$event'])
    public onKeyUp(ev: KeyboardEvent) {
        this.canvasGrille.actionToucheAppuyee(ev);
    }

    public ngAfterViewInit(): void {
        this.canvasGrille = new CanvasService(this.gameViewService, this.containerRef, this.indiceService, this.timerService);
    }

    public motTrouveActualiser(): void {
        if (this.canvasGrille) {
            this.canvasGrille.motTrouveRafraichirCanvas();
        }
    }

    private souscrireEvenementIndices() {
        this.indiceService.indiceSelectionne$.subscribe(indice => {
            if (!indice) {
                this.canvasGrille.initialise();
                this.canvasGrille.miseAJourIndice(null);
                return;
            }
            this.canvasGrille.miseAJourIndice(indice);
        });
        this.indiceService.indiceAdversaireSelectionne$.subscribe(indice => {
            if (!indice) {
                this.canvasGrille.initialise();
                return;
            }
            this.canvasGrille.miseAJourIndiceAdversaire(indice);
        });
    }

}
