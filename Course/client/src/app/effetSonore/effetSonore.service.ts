import { Injectable } from '@angular/core';
import { EffetSonore } from './effetSonore';

@Injectable()
export class EffetSonoreService {
  private effetSonoreTableau: EffetSonore[] = new Array<EffetSonore>();

  public jouerNouvelEffetSonore(NOM_EFFET_SONORE: string, loop: boolean = false): void {
    const nouvelEffetSonore = new EffetSonore();
    this.effetSonoreTableau.push(nouvelEffetSonore);

    nouvelEffetSonore.lancerEffetSonore(NOM_EFFET_SONORE, loop);

    this.arreterMusique();
  }

  private arreterMusique(): void {
    if (this.effetSonoreTableau.length > 3) {
        this.effetSonoreTableau[0].arreterMusique();
        this.effetSonoreTableau.shift();
    }
  }
}
