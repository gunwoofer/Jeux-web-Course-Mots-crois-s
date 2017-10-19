import {Component} from '@angular/core';
import {IndiceViewService} from '../indice/indice-view.service';
import {GameViewService} from '../game_view/game-view.service';
import {Niveau} from "../../../../commun/Niveau";
import {TypePartie} from "../../../../commun/TypePartie";


@Component({
  selector: 'app-choix-partie-view-component',
  templateUrl: './choix-partie-view.component.html',
  styleUrls: ['./choix-partie-view.component.css']
})

export class ChoixPartieViewComponent {
  public typePartie: TypePartie = TypePartie.classique;
  public niveauPartie: Niveau = Niveau.facile;
  public nbJoueursPartie = 0;
  public niveaux: Niveau[] = [Niveau.facile, Niveau.moyen, Niveau.difficile];
  public types: TypePartie[] = [TypePartie.classique, TypePartie.dynamique];
  public nbJoueurs: number[] = [0, 1];
  public niveauValue: string[] = ['facile', 'moyen', 'difficile'];
  public typePartieValue: string[] = ['classique', 'dynamique'];
  public nbJoueursValue: string[] = ['1 joueur', '2 joueurs'];

  constructor(private gameViewService: GameViewService) {

  }

  public ajouterTypePartie(typePartie: TypePartie): void {
    this.typePartie = typePartie;
  }

  public ajouterNiveauPartie(niveauPartie: Niveau): void {
    this.niveauPartie = niveauPartie;
  }

  public ajouterNbJoueursPartie(nbJoueurs: number): void {
    this.nbJoueursPartie = nbJoueurs;
  }

  public demanderCreationPartie() {
    this.gameViewService.demanderPartie(Niveau.facile, TypePartie.classique, this.nbJoueursPartie);
  }


}
