import {Component, OnInit} from '@angular/core';
import {SpecificationPartie} from '../../../commun/SpecificationPartie';
import {GameViewService} from './game_view/game-view.service';
import {Router} from '@angular/router';


export const ROUTE_PARTIE_CREE = 0;
export const  ROUTE_ATTENTE_PARTIE = 1;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

    constructor(private gameViewService: GameViewService, private router: Router) {
    }

    public title = 'LOG2990 - Groupe 10 - Mots Croisés';
    public message: string;
    public grille = '';
    public specificationPartie: SpecificationPartie;
    public ATTENTE_PARTIE = '/attentePartie';


    public ngOnInit(): void {
        this.gameViewService.initialiserConnexion();
        this.gameViewService.changementDeRoute.subscribe(route => {
            switch (route) {
                case ROUTE_PARTIE_CREE:
                    this.allerAPartieCreee();
                    break;
                case ROUTE_ATTENTE_PARTIE:
                    this.allerAAttentePartie();
                    break;
            }
        });
    }

    public allerAPartieCreee() {
        this.router.navigate([this.gameViewService.obtenirRoutePartie()]);
    }

    public allerAAttentePartie() {
        this.router.navigate([this.ATTENTE_PARTIE]);

    }

}
