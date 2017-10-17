import {Component, OnInit} from '@angular/core';
import {BasicService} from './basic.service';
import {Router} from '@angular/router';
import {ConnexionTempsReelClient} from './ConnexionTempsReelClient';
import * as requetes from '../../../commun/constantes/RequetesTempsReel';
import {SpecificationPartie} from '../../../commun/SpecificationPartie';
import {SpecificationGrille} from '../../../commun/SpecificationGrille';
import {TypePartie} from '../../../commun/TypePartie';
import {Joueur} from '../../../commun/Joueur';
import {Niveau} from '../../../commun/Niveau';
import {RequisPourMotAVerifier} from '../../../commun/RequisPourMotAVerifier';
import {GameViewService} from './game_view/game-view.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private basicService: BasicService, private gameViewService: GameViewService) {
  }

  public title = 'LOG2990 - Groupe 10 - Mots Croisés';
  public message: string;
  public grille = '';
  public specificationPartie: SpecificationPartie;
  public connexionTempsReelClient: ConnexionTempsReelClient;


  public ngOnInit(): void {
    // REQUETE CREER NOUVELLE PARTIE
    this.gameViewService.initialiserConnexion();
    this.gameViewService.demanderPartie(Niveau.facile, TypePartie.classique);
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
