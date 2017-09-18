import { Component, OnInit } from '@angular/core';

import {BasicService} from './basic.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor (private basicService: BasicService) {}

  public title = 'LOG2990';
  public message: string;
  public grille = '';
  public grillePersistente = '';

  public ngOnInit(): void {
    this.basicService.obtenirGrille().then(grille => this.afficherGrille(grille));
    this.basicService.obtenirGrillePersistente().then(grille => this.afficherGrillePersistente(grille));
  }

  public afficherGrillePersistente(grille:any) {
      this.grillePersistente = '<table border=1>';
      for(const casesLigne of grille.cases) {
        this.grillePersistente += '<tr>';
        for (const caseCourante of casesLigne) {
          this.grillePersistente += '<td>';
          if (caseCourante.lettre !== undefined) {
            this.grillePersistente += caseCourante.lettre;
          } else {
            this.grillePersistente += '*';
          }
          this.grillePersistente += '</td>';
        }
        this.grillePersistente += '</tr>';
      }
      this.grillePersistente += '</table>';

  }

  public afficherGrille(grille:any) {
    this.grille = '<table border=1>';
    for(const casesLigne of grille.cases) {
      this.grille += '<tr>';
      for (const caseCourante of casesLigne) {
        this.grille += '<td>';
        if (caseCourante.lettre !== undefined) {
          this.grille += caseCourante.lettre;
        } else {
          this.grille += '*';
        }
        this.grille += '</td>';
      }
      this.grille += '</tr>';
    }
    this.grille += '</table>';
  }
}
