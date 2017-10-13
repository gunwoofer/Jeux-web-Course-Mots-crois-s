import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import {Indice} from '../indice/indice';

@Injectable()
export class GameViewService {
  private grilleGenere = new Subject<SpecificationPartie>();
  public grilleGenere$ = this.grilleGenere.asObservable();

  private partieGeneree: SpecificationPartie;
  public indices: Indice[];

  constructor() {}

  public mettreAJourGrilleGeneree(specificationPartie: SpecificationPartie) {
    this.partieGeneree = specificationPartie;
    console.log('specification partie arrivée :', specificationPartie);
  }

  public mettreAJourIndice(indices: Indice[]){
    this.indices = indices;
  }

  public getPartie() {
    return this.partieGeneree;
  }
}
