import {Component, OnInit} from '@angular/core';
import {BasicService} from './basic.service';
import {ConnexionTempsReelClient} from './ConnexionTempsReelClient';
import {SpecificationPartie} from '../../../commun/SpecificationPartie';
import {TypePartie} from '../../../commun/TypePartie';
import {Niveau} from '../../../commun/Niveau';
import {RequisPourMotAVerifier} from '../../../commun/RequisPourMotAVerifier';
import {GameViewService} from './game_view/game-view.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(basicService: BasicService, private gameViewService: GameViewService) {
  }

  public title = 'LOG2990 - Groupe 10 - Mots Croisés';
  public message: string;
  public grille = '';
  public specificationPartie: SpecificationPartie;

  public ngOnInit(): void {
    // REQUETE CREER NOUVELLE PARTIE
    this.gameViewService.initialiserConnexion();
  }

  public rappelCreerPartieSolo(specificationPartie: SpecificationPartie, self: AppComponent): void {
    self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
    self.gameViewService.mettreAJourGrilleGeneree(self.specificationPartie);
  }

  public rappelVerifierMot(requisPourMotAVerifier: RequisPourMotAVerifier, self: AppComponent): void {
    if (requisPourMotAVerifier.estLeMot) {
      alert('Bravo, vous avez le bon mot.');
    } else {
      alert('Malheureusement, ce n\'est pas le bon mot.');
    }
  }

}
