import {Component, OnInit} from '@angular/core';
import {BasicService} from './basic.service';
import {SpecificationPartie} from '../../../commun/SpecificationPartie';
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
    this.gameViewService.initialiserConnexion();
  }

}
