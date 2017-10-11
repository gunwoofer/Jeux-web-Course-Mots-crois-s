import { Piste } from '../piste/piste.model';
import { PisteService } from './../piste/piste.service';
import { TableauScoreComponent } from '../tableauScore/tableauScore.component';
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
  public value;

  public ngOnInit() {
    this.pisteService.retournerListePiste().then((pistes: Piste[]) => this.listePistes = pistes);
  }

  public onSelect(piste) {
    this.pisteSelectionne = piste;
    console.log(this.pisteSelectionne);
  }


}

