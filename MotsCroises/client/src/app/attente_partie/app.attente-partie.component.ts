import { Component } from '@angular/core';
import { Niveau } from '../../../../commun/niveau';
import { SpecificationPartie } from '../../../../commun/specificationPartie';
import { ChoixPartieService } from '../choix_partie/choix-partie.service';
import { TypePartie } from '../../../../commun/typePartie';

@Component({
    selector: 'app-trouver-partie-component',
    templateUrl: './attente-partie.component.html',
    styleUrls: ['./attente-partie.component.css']
})

export class AttentePartieComponent {
    public nomJoueur = '';
    public specificationPartie: SpecificationPartie;
    public niveauPartie: string;
    public difficultePartie: string;

    constructor(private choixPartieService: ChoixPartieService) {
        this.nomJoueur = this.choixPartieService.joueur.obtenirNomJoueur();
        this.recupererDonnesPartie();
    }

    private recupererDonnesPartie(): void {
        this.specificationPartie = this.choixPartieService.specificationPartie;
        this.niveauPartie = Niveau[this.specificationPartie.niveau];
        this.difficultePartie = TypePartie[this.specificationPartie.typePartie];
    }
}
