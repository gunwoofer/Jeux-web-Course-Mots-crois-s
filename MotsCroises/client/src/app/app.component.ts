import {Component, OnInit} from '@angular/core';
import {SpecificationPartie} from '../../../commun/SpecificationPartie';
import {GameViewService} from './game_view/game-view.service';
import {Router} from '@angular/router';
import {ChoixPartieService} from './choix_partie/choix-partie.service';


export const ROUTE_PARTIE_CREE = 0;
export const  ROUTE_ATTENTE_PARTIE = 1;
export const ATTENTE_PARTIE = '/attentePartie';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {

    constructor() {
        //this.gameViewService.initialiserConnexion();
    }

    public title = 'LOG2990 - Groupe 10 - Mots Croisés';
    public message: string;
    public grille = '';
    public specificationPartie: SpecificationPartie;

}
