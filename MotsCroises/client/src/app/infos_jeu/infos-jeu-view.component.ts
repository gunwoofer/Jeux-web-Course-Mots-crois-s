import { Component } from '@angular/core';
import {IndiceViewService} from "../indice/indice-view.service";


@Component({
  selector: 'infos-jeu-view-component',
  templateUrl: './infos-jeu-view.component.html',
  styleUrls: ['./infos-jeu-view.component.css']
})

export class InfosJeuViewComponent  {
  public motEnCours1 : string = "banane";

  constructor(private indiceViewService: IndiceViewService) {
    this.indiceViewService.motEcrit$.subscribe(nouveauMot => {
      this.motEnCours1 = nouveauMot;
    });
  }


}
