import {Component} from '@angular/core';
import {SpecificationPartie} from '../../../commun/specificationPartie';


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
