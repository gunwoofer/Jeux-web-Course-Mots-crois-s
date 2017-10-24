import { MusiqueService } from './../musique/musique.service';
import { Component, OnInit } from '@angular/core';

import { Musique } from './../musique/musique.model';
import { Piste } from '../piste/piste.model';
import { PisteService } from './../piste/piste.service';


@Component({
  selector: 'app-listepiste-component',
  templateUrl: './listePiste.component.html',
  styleUrls: ['./listePiste.component.css']
})

export class ListePisteComponent implements OnInit {
  public listePistes: Piste[] = [];

  constructor(private pisteService: PisteService, private musiqueService: MusiqueService) {}

  public ngOnInit(): void {
    this.pisteService.retournerListePiste().then((pistes: Piste[]) => this.listePistes = pistes);
    this.musiqueService.arreterMusique();
    this.musiqueService.musique.lancerMusiqueThematique();
  }
}

