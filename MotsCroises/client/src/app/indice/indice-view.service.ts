import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {IndiceMot} from './indice';

@Injectable()
export class IndiceViewService {
  private indiceSelectionne = new Subject<IndiceMot>();
  private motEcrit = new Subject<string>();

  public indiceSelectionneL = this.indiceSelectionne.asObservable();
  public motEcrit$ = this.motEcrit.asObservable();

  constructor() {}

  public afficherSelectionIndice(indice: IndiceMot) {
    this.indiceSelectionne.next(indice);
  }

  public mettreAJourMotEntre(motEntre: string) {
    this.motEcrit.next(motEntre);
  }
}
