import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';

@Injectable()
export class GameViewService {
  private grilleGenere = new Subject<SpecificationPartie>();

  public grilleGenere$ = this.grilleGenere.asObservable();
  private partieGeneree: SpecificationPartie;

  constructor() {}


  public mettreAJourGrilleGeneree(specificationPartie: SpecificationPartie) {
    this.partieGeneree = specificationPartie;
    console.log('specification partie arrivée :', specificationPartie);
  }

  public getPartie() {
    return this.partieGeneree;
  }
}
