import { Piste } from '../piste/piste.model';
import { PisteService } from './../piste/piste.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listepiste-component',
  template: `
  <div class="col-md-8 col-md-offset-2">
    <app-piste-component [piste]="piste" *ngFor="let piste of listePistes"></app-piste-component>
    <button type="button" class="btn btn-primary-outline pull-right">
      <i class="fa fa-plus"></i>
      <a [routerLink]="['/createurPiste']">Creer une Nouvelle Piste</a>
    </button>
  </div>
  `,
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

