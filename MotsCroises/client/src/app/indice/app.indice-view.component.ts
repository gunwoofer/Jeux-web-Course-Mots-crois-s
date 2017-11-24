import {Component, OnInit} from '@angular/core';
import {GameViewService} from '../game_view/game-view.service';
import {IndiceMot} from './indiceMot';


@Component({
  selector: 'app-indice-view-component',
  templateUrl: './indice-view.component.html',
  styleUrls: ['./indice-view.component.css'],
})
export class IndiceViewComponent implements OnInit {
  public indices: IndiceMot[];
  public selectedIndice: IndiceMot;
  constructor(private gameViewService: GameViewService) {
  }

  public onSelect(indice: IndiceMot, event: Event): void {
    event.stopPropagation();
    if (indice.motTrouve) {
      return;
    }
    this.selectedIndice = indice;
    this.gameViewService.desactiverModificationTempsServeur();
    this.gameViewService.afficherSelectionIndice(indice);
  }

  public annulerSelectionIndice() {
    this.selectedIndice = null;
    this.gameViewService.afficherSelectionIndice(null);
  }

  public ngOnInit(): void {
    this.indices = [];
    this.indices = this.gameViewService.indices;
  }

}



