import { Piste } from '../piste/piste.model';
import { PisteService } from './../piste/piste.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listepiste-component',
  templateUrl: './listePiste.component.html',
  styleUrls: ['./listePiste.component.css']
})

export class ListePisteComponent implements OnInit {
  constructor(private pisteService: PisteService) { }

  public listePistes: Piste[] = [];
  public pisteSelectionne: Piste;
  public piste: Piste[];

  public ngOnInit() {
    this.listePistes = this.pisteService.retournerListePiste();
  }

  public onSelect(piste) {
    this.pisteSelectionne = piste;
    console.log(this.pisteSelectionne);
  }
}

