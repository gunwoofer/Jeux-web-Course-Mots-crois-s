import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Indice} from './indice-view.component';

@Injectable()
export class IndiceViewService {
  private indiceSelectionne = new Subject<Indice>();

  public indiceSelectionneL = this.indiceSelectionne.asObservable();



  constructor() {
  }

  public afficherSelectionIndice(indice: Indice){
    this.indiceSelectionne.next(indice);
  }

}
