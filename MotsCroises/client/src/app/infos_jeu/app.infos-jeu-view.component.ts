import {Component, Input} from '@angular/core';
import {IndiceViewService} from '../indice/indice-view.service';


@Component({
  selector: 'app-infos-jeu-view-component',
  templateUrl: './infos-jeu-view.component.html',
  styleUrls: ['./infos-jeu-view.component.css']
})

export class InfosJeuViewComponent  {

  @Input() public nbJoueurs: string;
  public motEnCoursJ1: string;
  public motEnCoursJ2: string;
  public motTrouveJ1: number;
  public motTrouveJ2: number;


  constructor(private indiceViewService: IndiceViewService) {
    this.indiceViewService.motEcrit$.subscribe(nouveauMot => {
      this.motEnCoursJ1 = nouveauMot;
    });
  }

}
