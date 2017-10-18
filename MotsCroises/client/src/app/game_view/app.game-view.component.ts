import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';


import 'rxjs/add/operator/switchMap';
import {GameViewService} from './game-view.service';
import {CanvasViewComponent} from '../canvas/app.canvas-view.component';
import {InfosJeuViewComponent} from '../infos_jeu/app.infos-jeu-view.component';


@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})

export class GameViewComponent implements OnInit {
  public nbJoueurs: string;

  @ViewChild(CanvasViewComponent)
  private canvasViewComponent: CanvasViewComponent;

  @ViewChild(InfosJeuViewComponent)
  private infosJeuViewComponent: InfosJeuViewComponent;

  constructor(private route: ActivatedRoute,
              private gameViewService: GameViewService) {
    this.gameViewService.motTrouveJ1$.subscribe(() => {
      this.actualiserGrille();
    });
    this.gameViewService.partieTeminee$.subscribe(() => {
      this.infosJeuViewComponent.stopperTimer();
    });
  }

  public ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.nbJoueurs = params.get('nbJoueurs'))
      .subscribe();
  }

  public actualiserGrille() {
    this.canvasViewComponent.rafraichirCanvas();
  }

}
