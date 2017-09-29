import { Component } from '@angular/core';


@Component({
  selector: 'indice-view-component',
  templateUrl: './indice-view.component.html',
  styleUrls: ['./indice-view.component.css']
})

export class IndiceViewComponent  {
  public indices: Indice[]= INDICES;
  public selectedIndice: Indice;
  constructor() { }

  public onSelect(indice: Indice): void {
    this.selectedIndice = indice;
  }



}

// MOCK
export const INDICES: Indice[] = [
  { id: 11, name: 'voiture', tailleMot: 7, sens: true, positionI: 3, positionJ: 5 },
  { id: 12, name: 'Biboum', tailleMot: 5, sens: false, positionI: 4, positionJ: 6 },
  { id: 13, name: 'Karam', tailleMot: 5, sens: true, positionI: 2, positionJ: 8 }
];

export class Indice {
  public id: number;
  public name: string;
  public tailleMot: number;
  public sens: boolean; // False = horizontal, True = vertical
  public positionI:  number;
  public positionJ: number;


  constructor(id: number, name: string, tailleMot: number, sens: boolean, positionI: number, positionJ: number) {
    this.id = id;
    this.name = name;
    this.tailleMot = tailleMot;
    this.sens = sens;
    this.positionI = positionI;
    this.positionJ = positionJ;
  }
}
