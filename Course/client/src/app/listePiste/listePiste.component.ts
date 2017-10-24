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
  private musique: Musique;

  constructor(private pisteService: PisteService) {
    this.musique = new Musique();
  }

  public ngOnInit(): void {
    this.pisteService.retournerListePiste().then((pistes: Piste[]) => this.listePistes = pistes);
    this.musique.lancerMusiqueThematique();
  }
}

