import {AfterViewInit, Component, Input} from '@angular/core';
import {IndiceViewService} from '../indice/indice-view.service';


@Component({
  selector: 'choix-partie-view-component',
  templateUrl: './choix-partie-view.component.html',
  styleUrls: ['./choix-partie-view.component.css']
})

export class ChoixPartieViewComponent  {
  public typePartie = 'classique';
  public niveauPartie = 'normal';
  public nbJoueursPartie = '1 joueur';
  public niveaux: string[] = ['facile', 'moyen', 'difficile'];
  public types: string[] = ['classique', 'dynamique'];
  public nbJoueurs: string[] = ['1 joueur', '2 joueurs'];

  constructor(private indiceViewService: IndiceViewService) {

  }


  public ajouterTypePartie(typePartie: string): void {
    this.typePartie = typePartie;
  }

  public ajouterNiveauPartie(niveauPartie: string): void {
    this.niveauPartie = niveauPartie;
  }

  public ajouterNbJoueursPartie(nbJoueurs: string): void {
    this.nbJoueursPartie = nbJoueurs;
  }

}
