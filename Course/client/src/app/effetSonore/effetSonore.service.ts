import { Injectable } from '@angular/core';
import { EffetSonore } from './effetSonore.model';

@Injectable()

export class EffetSonoreService {
  public effetSonoreTableau: EffetSonore[];

  constructor() {
    this.effetSonoreTableau = new Array<EffetSonore>();
  }

  public jouerNouvelEffetSonore(NOM_EFFET_SONORE: string, loop: boolean = false): void {
    const nouvelEffetSonore = new EffetSonore();
    this.effetSonoreTableau.push(nouvelEffetSonore);
    nouvelEffetSonore.lancerEffetSonore(NOM_EFFET_SONORE, loop);
    if (this.effetSonoreTableau.length > 3) {
      this.effetSonoreTableau[0].arreterMusique();
      this.effetSonoreTableau.shift();
    }
  }
}
