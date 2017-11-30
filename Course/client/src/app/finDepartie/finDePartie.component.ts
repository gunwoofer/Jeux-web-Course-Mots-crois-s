import { GENERATION_PISTE, LISTE_PISTE } from './../constant';
import { Router } from '@angular/router';
import { Component } from '@angular/core';


@Component({
    selector: 'app-finpartie',
    templateUrl: './finDePartie.component.html',
    styleUrls: ['./finDePartie.component.css']
})

export class FinDePartieComponent {

    constructor(private router: Router) { }

    public jouerUneNouvellePartie(): void {
        this.router.navigateByUrl(GENERATION_PISTE);
    }

    public allerAuMenuPrincipale(): void {
        this.router.navigateByUrl(LISTE_PISTE);
    }
}
