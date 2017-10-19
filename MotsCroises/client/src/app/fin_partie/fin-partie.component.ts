import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {Niveau} from '../../../../commun/Niveau';
import {TypePartie} from '../../../../commun/TypePartie';
import {GameViewService} from '../game_view/game-view.service';
@Component({
    selector: 'app-finpartie-component',
    templateUrl: './fin-partie.component.html',
    styleUrls: ['./fin-partie.component.css']
})

export class FinPartieComponent {


  constructor(private router: Router, private gameViewService: GameViewService) {
  }

  private retourMenuPrincipal(): void {
    this.router.navigate(['']);
  }

  private recommencerPartie(): void {
    this.gameViewService.recommencerPartie();
  }

}
