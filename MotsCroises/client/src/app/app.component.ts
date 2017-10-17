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
import {GameViewService} from "./game_view/game-view.service";

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

  public rappelCreerPartieSolo(specificationPartie: SpecificationPartie, self: AppComponent) {
    self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);

    console.log('specification partie 1:', self.specificationPartie );
    console.log(self.gameViewService);
    self.gameViewService.mettreAJourGrilleGeneree(self.specificationPartie);

    /*code test
    // REQUETE VERIFIER MOT
    const requisPourMotAVerifierMauvais: RequisPourMotAVerifier = new RequisPourMotAVerifier(
      self.specificationPartie.specificationGrilleEnCours.emplacementMots[0],
      'XYZ', self.specificationPartie.joueur.obtenirGuid(), self.specificationPartie.guidPartie);
    self.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourMotAVerifier>(requetes.REQUETE_SERVER_VERIFIER_MOT,
      requisPourMotAVerifierMauvais, requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, self.rappelVerifierMot, this);
    */
  }

  public rappelVerifierMot(requisPourMotAVerifier: RequisPourMotAVerifier, self: AppComponent) {
    if (requisPourMotAVerifier.estLeMot) {
      // alert('Bravo, vous avez le bon mot.');
    } else {
      // alert('Malheureusement, ce n\'est pas le bon mot.');
    }
  }

}
