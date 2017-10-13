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
    this.MAJIndices(this.gameViewService.getPartie().specificationGrilleEnCours.emplacementMots);
  }

  private MAJIndices(emplacementMots: EmplacementMot[]){
    console.log(emplacementMots);
    for (const i of emplacementMots){
      this.indices.push(new Indice(i.obtenirIndexFixe() + 1, i.obtenirGuidIndice(), i.obtenirGrandeur(), i.obtenirPosition(),
        i.obtenirCaseDebut().obtenirNumeroColonne() + 1 ,
        i.obtenirCaseDebut().obtenirNumeroLigne() + 1, ''));
    }
    this.gameViewService.mettreAJourIndice(this.indices);
  }
}



