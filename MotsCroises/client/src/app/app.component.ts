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

  public ngOnInit(): void {
    this.basicService.obtenirGrille().then(grille => this.afficherGrille(grille));
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
