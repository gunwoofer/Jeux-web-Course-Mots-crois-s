import { Component, OnInit } from '@angular/core';

import { Piste } from '../piste/piste.model';
import { PisteService } from './../piste/piste.service';


@Component({
  selector: 'app-listepiste-component',
  templateUrl: './listePiste.component.html',
  styleUrls: ['./listePiste.component.css']
})

export class ListePisteComponent implements OnInit {
  constructor(private pisteService: PisteService) { }

  public listePistes: Piste[] = [];

  public ngOnInit(): void {
    this.pisteService.retournerListePiste().then((pistes: Piste[]) => this.listePistes = pistes);
    const musique = new Audio('../../assets/musiques/Get The New World.mp3');
    musique.play();
  }

}

