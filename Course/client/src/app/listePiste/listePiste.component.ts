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
  public listePistes: Piste[] = [];
  public estUnAdmin: boolean;

  constructor(private pisteService: PisteService, private musiqueService: MusiqueService, 
    private utilisateurService: UtilisateurService) { }

  public ngOnInit(): void {
    if (this.utilisateurService.isAdmin) {
      this.estUnAdmin = true;
    }
    this.pisteService.retournerListePiste().then((pistes: Piste[]) => this.listePistes = pistes);
    this.musiqueService.musique.arreterMusique();
    this.musiqueService.musique.lancerMusiqueThematique();

    const a = '3min 30s';
    const aMa = '3min 40s';
    if (a > aMa) {
      console.log(a.localeCompare(aMa));
    } else if (a < aMa) {
      console.log(a.localeCompare(aMa));
    } else if (a.localeCompare(aMa) === 0) { console.log('ils sont égaux'); }
  }
}

