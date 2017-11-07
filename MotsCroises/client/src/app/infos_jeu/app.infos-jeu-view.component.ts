import {AfterViewInit, Component, Input} from '@angular/core';
import {IndiceViewService} from '../indice/indice-view.service';
import {GameViewService} from '../game_view/game-view.service';


@Component({
  selector: 'app-infos-jeu-view-component',
  templateUrl: './infos-jeu-view.component.html',
  styleUrls: ['./infos-jeu-view.component.css']
})

export class InfosJeuViewComponent implements AfterViewInit {
  @Input()
  public nbJoueurs: string;
  public motEnCoursJ1: string;
  public motEnCoursJ2: string;
  public motTrouveJ1 = 0;
  public motTrouveJ2 = 0;
  private tempsActuel: number;
  public tempsRestant = 30;
  private dureeGrille = 30000;
  public tempsFin: number;
  private intervalFunction: any;


  constructor(private indiceViewService: IndiceViewService, private gameViewService: GameViewService) {
    this.indiceViewService.motEcrit$.subscribe(nouveauMot => {
      this.motEnCoursJ1 = nouveauMot;
    });
    this.gameViewService.motTrouveJ1$.subscribe(nouveauMot => {
      this.motTrouveJ1 = this.motTrouveJ1 + 1;
      this.recommencerTimer();
    });
  }

  public ngAfterViewInit(): void {
    this.recommencerTimer();
    this.intervalFunction = setInterval(() => {
      this.MAJTemps();
    }, 1000);
  }

  private recommencerTimer() {
    this.tempsFin = Date.now() + this.dureeGrille;
  }

  private MAJTemps() {
    this.tempsActuel = Date.now();
    this.tempsRestant = Math.round((this.tempsFin - this.tempsActuel) / 1000);
    if (this.tempsRestant < 0) {
      this.gameViewService.partieTermineeFauteDeTemps(true);
    }
  }

  public activerCheatMode(): void {
    this.gameViewService.demanderMotsComplets();
  }

  public stopperTimer() {
    clearInterval(this.intervalFunction);
  }


}
