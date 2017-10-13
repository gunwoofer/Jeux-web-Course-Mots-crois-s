import {Component, OnInit} from '@angular/core';
import {IndiceViewService} from "./indice-view.service";
import {GameViewService} from "../game_view/game-view.service";
import {EmplacementMot} from "../../../../commun/EmplacementMot";
import {Indice} from "./indice";


@Component({
  selector: 'indice-view-component',
  templateUrl: './indice-view.component.html',
  styleUrls: ['./indice-view.component.css'],
})

export class IndiceViewComponent implements OnInit {
  public indices: Indice[];
  public selectedIndice: Indice;
  constructor(private indiceViewService: IndiceViewService, private gameViewService: GameViewService) {
  }

  public onSelect(indice: Indice, event: Event): void {
    event.stopPropagation();
    if (indice.motTrouve) {
      return;
    }
    this.selectedIndice = indice;
    this.indiceViewService.afficherSelectionIndice(indice);
  }

  public annulerSelectionIndice() {
    this.selectedIndice = null;
    this.indiceViewService.afficherSelectionIndice(null);
  }

  public ngOnInit(): void {
    this.indices = [];
    this.indices = this.gameViewService.indices;
  }

}



