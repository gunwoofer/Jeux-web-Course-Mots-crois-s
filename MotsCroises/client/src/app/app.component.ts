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
  public grillePersistenteFacile = '';
  public grillePersistenteMoyen = '';
  public grillePersistenteDifficile = '';
  public niveaux: string[] = ['facile', 'moyen', 'difficile'];
  public types: string[] = ['classique', 'dynamique'];
  public nbJoueurs: string[] = ['1 joueur', '2 joueurs'];
  public typePartie = 'classique';
  public niveauPartie = 'normal';
  public estConnecte = false;
  public emplacementsMot = '';
  public specificationPartie: SpecificationPartie;
  public grilleVenantDeSpecificationPartie = '';
  public connexionTempsReelClient: ConnexionTempsReelClient;
  public nbJoueursPartie = '1 joueur';

  public ngOnInit(): void {
    this.basicService.ajouterGrillesDeDepart();
    this.basicService.obtenirGrille().then(grille => this.afficherGrille(grille));
    this.basicService.obtenirGrillePersistenteFacile().then(grille => this.afficherGrillePersistenteFacile(grille));
    this.basicService.obtenirGrillePersistenteMoyen().then(grille => this.afficherGrillePersistenteMoyen(grille));
    this.basicService.obtenirGrillePersistenteDifficile().then(grille => this.afficherGrillePersistenteDifficile(grille));

    // REQUETE CREER NOUVELLE PARTIE
    this.connexionTempsReelClient = new ConnexionTempsReelClient();
    const joueur: Joueur = new Joueur();
    this.specificationPartie = new SpecificationPartie(Niveau.facile, joueur, TypePartie.classique);
    this.connexionTempsReelClient.envoyerRecevoirRequete<SpecificationPartie>(requetes.REQUETE_SERVER_CREER_PARTIE_SOLO,
      this.specificationPartie, requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, this.rappelCreerPartieSolo, this);
  }

  public rappelCreerPartieSolo(specificationPartie: SpecificationPartie, self: AppComponent) {
    self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);

    self.afficherGrilleVenantDeSpecificationPartie(specificationPartie.specificationGrilleEnCours);
    console.log('specification partie 1:', self.specificationPartie );
    console.log(self.gameViewService);
    self.gameViewService.mettreAJourGrilleGeneree(self.specificationPartie);

    // REQUETE VERIFIER MOT
    const requisPourMotAVerifierMauvais: RequisPourMotAVerifier = new RequisPourMotAVerifier(
      self.specificationPartie.specificationGrilleEnCours.emplacementMots[0],
      'XYZ', self.specificationPartie.joueur.obtenirGuid(), self.specificationPartie.guidPartie);
    self.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourMotAVerifier>(requetes.REQUETE_SERVER_VERIFIER_MOT,
      requisPourMotAVerifierMauvais, requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, self.rappelVerifierMot, this);
  }

  public rappelVerifierMot(requisPourMotAVerifier: RequisPourMotAVerifier, self: AppComponent) {
    if (requisPourMotAVerifier.estLeMot) {
      alert('Bravo, vous avez le bon mot.');
    } else {
      alert('Malheureusement, ce n\'est pas le bon mot.');
    }
  }

  public afficherGrillePersistenteFacile(grille: any): void {
    this.grillePersistenteFacile = this.obtenirTableauMotsCroises(grille);
  }

  public afficherGrillePersistenteMoyen(grille: any): void {
    this.grillePersistenteMoyen = this.obtenirTableauMotsCroises(grille);
  }

  public afficherGrillePersistenteDifficile(grille: any): void {
    this.grillePersistenteDifficile = this.obtenirTableauMotsCroises(grille);
  }

  public afficherGrilleVenantDeSpecificationPartie(grille: SpecificationGrille): void {
    this.grilleVenantDeSpecificationPartie = this.obtenirTableauMotsCroises(grille);
  }

  public afficherGrille(grille: any): void {
    this.grille = this.obtenirTableauMotsCroises(grille);
    for (const emplacementMot of grille.emplacementMots) {
      this.emplacementsMot += 'Debut : {' + emplacementMot.caseDebut.numeroLigne + ',' + emplacementMot.caseDebut.numeroColonne + '}';
      this.emplacementsMot += ' | Fin : {' + emplacementMot.caseFin.numeroLigne + ',' + emplacementMot.caseFin.numeroColonne + '}';
      this.emplacementsMot += ' | Grandeur : ' + emplacementMot.grandeur + '<br />';

    }
  }

  public obtenirTableauMotsCroises(grille: any): string {
    let grilleEnTableau = '';
    grilleEnTableau = '<table border=1>';
    for (const casesLigne of grille.cases.cases) {
      grilleEnTableau += '<tr>';
      for (const caseCourante of casesLigne) {
        grilleEnTableau += '<td>';
        if (caseCourante.lettre !== '') {
          grilleEnTableau += caseCourante.lettre;
        } else {
          grilleEnTableau += '*';
        }
        grilleEnTableau += '</td>';
      }
      grilleEnTableau += '</tr>';
    }
    grilleEnTableau += '</table>';
    return grilleEnTableau;
  }

  public ajouterTypePartie(typePartie: string): void {
    this.typePartie = typePartie;
  }

  public ajouterNiveauPartie(niveauPartie: string): void {
    this.niveauPartie = niveauPartie;
  }

  public ajouterNbJoueursPartie(nbJoueurs: string): void {
    this.nbJoueursPartie = nbJoueurs;
  }
}
