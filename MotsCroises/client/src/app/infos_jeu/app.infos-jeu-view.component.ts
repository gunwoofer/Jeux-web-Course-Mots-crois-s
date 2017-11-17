import {AfterViewInit, Component, Input} from '@angular/core';
import {GameViewService} from '../game_view/game-view.service';
import {Joueur} from '../../../../commun/Joueur';


@Component({
  selector: 'app-infos-jeu-view-component',
  templateUrl: './infos-jeu-view.component.html',
  styleUrls: ['./infos-jeu-view.component.css']
})

export class InfosJeuViewComponent implements AfterViewInit {
  @Input()
  public nbJoueurs: string;

  private FREQUENCE_DECREMENTATION_TEMPS_EN_MS = 1000;
  private FREQUENCE_INTERROGATION_SERVEUR_TEMPS_EN_MS = 10000;

  public motEnCoursJ1: string;
  public tempsRestant = 0;
  private dureeGrille = 3000000;
  public tempsFin: number;
  private intervalFunction: any;
  private intervalFunctionServer: any;
  public joueur: Joueur;
  public joueur2: Joueur;
  public cheatModeVisible = false;
  public tempsRestantAEnvoyer: number;


  constructor(private gameViewService: GameViewService) {
    this.gameViewService.motEcrit$.subscribe(nouveauMot => {
      this.motEnCoursJ1 = nouveauMot;
    });
    this.gameViewService.modifierTempsRestant$.subscribe(nouveauTemps => {
      this.tempsRestant = Math.round(nouveauTemps / 1000);
    });

    this.joueur = this.gameViewService.joueur;
    this.joueur2 = this.gameViewService.joueur2;
  }

  public ngAfterViewInit(): void {
    this.recommencerTimer();
    this.demarrerFonctionIntervalTemps();
  }

  private recommencerTimer() {
    this.tempsFin = Date.now() + this.dureeGrille;
  }

  private demarrerFonctionIntervalTemps() {
    this.intervalFunction = setInterval(() => {
      this.MAJTemps();
    }, this.FREQUENCE_DECREMENTATION_TEMPS_EN_MS);
    this.intervalFunctionServer = setInterval(() => {
      this.MAJTempsServer();
    }, this.FREQUENCE_INTERROGATION_SERVEUR_TEMPS_EN_MS);
  }

  private MAJTemps() {
    this.tempsRestant = this.tempsRestant + 1;
    if (this.tempsRestant < 0) {
      this.gameViewService.partieTermineeFauteDeTemps(true);
    }
  }

  public recupererMotsCheatMode(): void {
    this.gameViewService.demanderMotsComplets();
  }

  public afficherCheatMode(): void {
    this.cheatModeVisible =  !this.cheatModeVisible;
  }


  private MAJTempsServer() {
    this.gameViewService.demanderTempsPartie();
  }

  public stopperIntervalFonction() {
    clearInterval(this.intervalFunction);
    clearInterval(this.intervalFunctionServer);
  }
}
