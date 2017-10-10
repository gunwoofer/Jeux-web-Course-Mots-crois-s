import { Component, OnInit } from '@angular/core';

import { BasicService } from './basic.service';
import { Router } from '@angular/router';
import { ConnexionTempsReelClient } from './ConnexionTempsReelClient';
import * as requetes from '../../../commun/constantes/RequetesTempsReel';
import { SpecificationPartie } from '../../../commun/SpecificationPartie';
import { SpecificationGrille } from '../../../commun/SpecificationGrille';
import { TypePartie } from '../../../commun/TypePartie';
import { Joueur } from '../../../commun/Joueur';
import { Niveau } from '../../../commun/Niveau';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private basicService: BasicService) { }

  public title = 'LOG2990';
  public message: string;
  public grille = '';
  public grillePersistenteFacile = '';
  public grillePersistenteMoyen = '';
  public grillePersistenteDifficile = '';
  public niveaux: string[] = ['facile', 'moyen', 'difficile'];
  public types: string[] = ['classique', 'dynamique'];
  public typePartie = 'classique';
  public niveauPartie = 'normal';
  public estConnecte = false;

  public emplacementsMot = '';
  public specificationPartie: SpecificationPartie;
  public grilleVenantDeSpecificationPartie = '';

  public ngOnInit(): void {
    this.basicService.ajouterGrillesDeDepart();
    this.basicService.obtenirGrille().then(grille => this.afficherGrille(grille));
    this.basicService.obtenirGrillePersistenteFacile().then(grille => this.afficherGrillePersistenteFacile(grille));
    this.basicService.obtenirGrillePersistenteMoyen().then(grille => this.afficherGrillePersistenteMoyen(grille));
    this.basicService.obtenirGrillePersistenteDifficile().then(grille => this.afficherGrillePersistenteDifficile(grille));

    // Communication temps réel avec le serveur.
    const connexionTempsReelClient: ConnexionTempsReelClient = new ConnexionTempsReelClient();
    const joueur: Joueur = new Joueur();
    this.specificationPartie = new SpecificationPartie(Niveau.facile, joueur, TypePartie.classique);
    connexionTempsReelClient.envoyerRecevoirRequete(requetes.REQUETE_SERVER_CREER_PARTIE_SOLO,
      this.specificationPartie, requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, this.rappelCreerPartieSolo, this);
  }

  public rappelCreerPartieSolo(specificationPartie: SpecificationPartie, self: AppComponent) {
      self.specificationPartie = specificationPartie;
      self.afficherGrilleVenantDeSpecificationPartie(specificationPartie.specificationGrilleEnCours);
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
}
