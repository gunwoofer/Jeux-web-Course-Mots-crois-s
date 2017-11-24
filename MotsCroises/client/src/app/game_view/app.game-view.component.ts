import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';


import 'rxjs/add/operator/switchMap';
import { GameViewService } from './game-view.service';
import { CanvasViewComponent } from '../canvas/app.canvas-view.component';
import { InfosJeuViewComponent } from '../infos_jeu/app.infos-jeu-view.component';
import { IndiceViewComponent } from '../indice/app.indice-view.component';


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

  @ViewChild(IndiceViewComponent)
  private indiceViewComponent: IndiceViewComponent;

  constructor(private route: ActivatedRoute,
    private gameViewService: GameViewService,
    private router: Router) {
    this.gameViewService.motTrouve$.subscribe(() => {
      this.actualiserGrille();
    });
    this.gameViewService.partieTeminee$.subscribe(() => {
      this.infosJeuViewComponent.stopperIntervalFonction();
      this.allerAPartieTerminee();
    });
    this.gameViewService.modificationTemps$.subscribe(() => {
      this.indiceViewComponent.annulerSelectionIndice();
    });

    if (!this.testPartieExiste()) {
      this.retourAccueil();
    }
  }

  public ngOnInit(): void {
    this.obtenirNombreDeJoueurs();
  }

  public actualiserGrille() {
    this.canvasViewComponent.motTrouveActualiser();
  }

  private allerAPartieTerminee(): void {
    this.router.navigate(['/partieTerminee']);
  }

  private testPartieExiste(): boolean {
    if (this.gameViewService.indices) {
      return true;
    }
    return false;
  }

  private retourAccueil(): void {
    this.router.navigate(['/']);
  }

  private obtenirNombreDeJoueurs() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.nbJoueurs = params.get('nbJoueurs'))
      .subscribe();
  }

}
