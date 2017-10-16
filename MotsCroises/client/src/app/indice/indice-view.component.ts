import {Component, OnInit} from '@angular/core';
import {IndiceViewService} from "./indice-view.service";
import {GameViewService} from "../game_view/game-view.service";
import {EmplacementMot} from "../../../../commun/EmplacementMot";


@Component({
  selector: 'indice-view-component',
  templateUrl: './indice-view.component.html',
  styleUrls: ['./indice-view.component.css'],
})

export class IndiceViewComponent implements OnInit {
  public indices: Indice[]= INDICES;
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
    this.MAJIndices(this.gameViewService.getPartie().specificationGrilleEnCours.emplacementMots);
  }

  private MAJIndices(emplacementMots: EmplacementMot[]){
    for (const i of emplacementMots){
      INDICES.push(new Indice(i.obtenirIndexFixe() + 1, i.obtenirIndice(), i.obtenirGrandeur(), i.obtenirPosition(),
        i.obtenirCaseDebut().obtenirNumeroColonne() + 1 ,
        i.obtenirCaseDebut().obtenirNumeroLigne() + 1, false));
    }
  }
}

// MOCK
export const INDICES: Indice[] = [
  //{ id: 11, name: 'voiture', tailleMot: 7, sens: 0, positionI: 3, positionJ: 5, motTrouve: false},
  //{ id: 12, name: 'Biboum', tailleMot: 5, sens: 1, positionI: 4, positionJ: 6, motTrouve: false },
  //{ id: 13, name: 'Karam', tailleMot: 5, sens: 0, positionI: 2, positionJ: 8, motTrouve: true },
  //{ id: 14, name: 'BoumBoum', tailleMot: 8, sens: 1, positionI: 2, positionJ: 1, motTrouve: false }
];

export const INDICESVERTICAL: Indice[] = [

];

export class Indice {
  public id: number;
  public name: string;
  public tailleMot: number;
  public sens: number; // False = horizontal, True = vertical
  public positionI:  number;
  public positionJ: number;
  public motTrouve: boolean;

  constructor(id: number, name: string, tailleMot: number, sens: number, positionI: number, positionJ: number, motTrouve: boolean = false) {
    this.id = id;
    this.name = name;
    this.tailleMot = tailleMot;
    this.sens = sens;
    this.positionI = positionI;
    this.positionJ = positionJ;
    this.motTrouve = motTrouve;
  }
}

