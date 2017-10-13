import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Indice} from './indice';

@Injectable()
export class IndiceViewService {
  private indiceSelectionne = new Subject<Indice>();
  private motEcrit = new Subject<string>();

  public indiceSelectionneL = this.indiceSelectionne.asObservable();
  public motEcrit$ = this.motEcrit.asObservable();

  constructor() {}

  public afficherSelectionIndice(indice: Indice) {
    this.indiceSelectionne.next(indice);
  }

  public mettreAJourMotEntre(motEntre: string) {
    this.motEcrit.next(motEntre);
  }
}
