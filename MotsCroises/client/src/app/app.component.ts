import { Component, OnInit } from '@angular/core';

import { BasicService } from './basic.service';

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

  public ngOnInit(): void {
    this.basicService.ajouterGrillesDeDepart();
    this.basicService.obtenirGrille().then(grille => this.afficherGrille(grille));
    this.basicService.obtenirGrillePersistenteFacile().then(grille => this.afficherGrillePersistenteFacile(grille));
    this.basicService.obtenirGrillePersistenteMoyen().then(grille => this.afficherGrillePersistenteMoyen(grille));
    this.basicService.obtenirGrillePersistenteDifficile().then(grille => this.afficherGrillePersistenteDifficile(grille));
  }

  public afficherGrillePersistenteFacile(grille: any) {
    this.grillePersistenteFacile = this.obtenirTableauMotsCroises(grille);
  }

  public afficherGrillePersistenteMoyen(grille: any) {
    this.grillePersistenteMoyen = this.obtenirTableauMotsCroises(grille);
  }

  public afficherGrillePersistenteDifficile(grille: any) {
    this.grillePersistenteDifficile = this.obtenirTableauMotsCroises(grille);
  }

  public afficherGrille(grille: any) {
    this.grille = this.obtenirTableauMotsCroises(grille);
  }

  public obtenirTableauMotsCroises(grille: any): string {
    let grilleEnTableau = '';
    grilleEnTableau = '<table border=1>';
    for (const casesLigne of grille.cases) {
      grilleEnTableau += '<tr>';
      for (const caseCourante of casesLigne) {
        grilleEnTableau += '<td>';
        if (caseCourante.lettre !== undefined) {
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
}
