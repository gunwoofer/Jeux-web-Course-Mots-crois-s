import { Piste } from '../piste/piste.model';
import { PisteService } from './../piste/piste.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listepiste-component',
  template: `
  <div class="col-md-8 col-md-offset-2">
    <app-piste-component [piste]="piste" *ngFor="let piste of listePistes"></app-piste-component>
  </div>
  `,
})

export class ListePisteComponent implements OnInit {
  constructor(private pisteService: PisteService) { }

  public listePistes: Piste[];

  public ngOnInit() {
    this.pisteService.retournerListePiste();
  }
}
