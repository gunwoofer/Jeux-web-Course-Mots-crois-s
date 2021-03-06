import { PisteValidationComponent } from './../pisteValidator/pisteValidation.component';
import { UtilisateurService } from './../accueil/utilisateur.service';
import { MusiqueService } from './../musique/musique.service';
import { Component, OnInit } from '@angular/core';

import { Piste } from '../piste/piste.model';
import { PisteService } from './../piste/piste.service';


@Component({
    selector: 'app-listepiste-component',
    templateUrl: './listePiste.component.html',
    styleUrls: ['./listePiste.component.css']
})

export class ListePisteComponent implements OnInit {
    public listePistes: Piste[] = new Array();
    public estUnAdmin: boolean;

    constructor(private pisteService: PisteService, private musiqueService: MusiqueService,
        private utilisateurService: UtilisateurService) { }

    public ngOnInit(): void {
        if (this.utilisateurService.estAdmin && (PisteValidationComponent.promuAdmin)) {
            this.estUnAdmin = true;
        }
        this.pisteService.retournerListePiste().then((pistes: Piste[]) => { this.listePistes = pistes; });

        if (!this.musiqueService.musique.thematique) {
            this.musiqueService.musique.arreterMusique();
            this.musiqueService.musique.lancerMusiqueThematique();
        }
    }
}

