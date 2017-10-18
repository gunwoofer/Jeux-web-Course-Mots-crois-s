import {AfterViewInit, Component, Input} from '@angular/core';
import {IndiceViewService} from '../indice/indice-view.service';
import {GameViewService} from '../game_view/game-view.service';


@Component({
  selector: 'app-infos-jeu-view-component',
  templateUrl: './infos-jeu-view.component.html',
  styleUrls: ['./infos-jeu-view.component.css']
})

export class InfosJeuViewComponent implements AfterViewInit {


  @Input() public nbJoueurs: string;
  public motEnCoursJ1: string;
  public motEnCoursJ2: string;
  public motTrouveJ1 = 0;
  public motTrouveJ2 = 0;
  private tempsDebut: number;
  private tempsActuel: number;
  public dureeJeu = 0;
  private intervalFunction: any;


  constructor(private indiceViewService: IndiceViewService, private gameViewService: GameViewService) {
    this.indiceViewService.motEcrit$.subscribe(nouveauMot => {
      this.motEnCoursJ1 = nouveauMot;
    });
    this.gameViewService.motTrouveJ1$.subscribe(nouveauMot => {
      this.motTrouveJ1 = this.motTrouveJ1 + 1;
    });
  }

  public ngAfterViewInit(): void {
    this.tempsDebut = Date.now();
    this.intervalFunction = setInterval(() => {
      this.MAJTemps();
    }, 1000);
  }

  private MAJTemps() {
    this.tempsActuel = Date.now();
    this.dureeJeu = Math.round((this.tempsActuel - this.tempsDebut) / 1000);
  }

  public stopperTimer() {
    clearInterval(this.intervalFunction);
  }


}
