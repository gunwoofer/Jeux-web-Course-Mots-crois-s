import {Component, OnInit} from '@angular/core';
import {GameViewService} from '../game_view/game-view.service';
import {VuePartieEnCours} from '../../../../commun/VuePartieEnCours';
import {EnumUtilitaires} from '../../../../commun/EnumUtilitaires';
import {Niveau} from '../../../../commun/Niveau';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import { TypePartie } from '../../../../commun/TypePartie';


@Component({
  selector: 'app-trouver-partie-component',
  templateUrl: './attente-partie.component.html',
  styleUrls: ['./attente-partie.component.css']
})

export class AttentePartieComponent implements OnInit {
  public nomJoueur = '';
  public nomJoueur2 = '';
  public partieSelectionne: VuePartieEnCours;
  public specificationPartie: SpecificationPartie;
  public niveauPartie: string;
  public difficultePartie: string;

  constructor(private gameViewService: GameViewService) {
    this.nomJoueur = this.gameViewService.joueur.obtenirNomJoueur();
    this.specificationPartie = this.gameViewService.specificationPartie;
    this.niveauPartie = EnumUtilitaires.chaine_de_caractere_depuis_enum(Niveau, this.gameViewService.specificationPartie.niveau);
    this.difficultePartie = EnumUtilitaires.chaine_de_caractere_depuis_enum(Niveau, this.gameViewService.specificationPartie.typePartie);
  }

  public ngOnInit(): void {
    this.gameViewService.demanderPartieServer(TypePartie.classique_a_deux);
  }


  public retournerNiveau(partie) {
    return EnumUtilitaires.chaine_de_caractere_depuis_enum(Niveau, partie.niveau);
  }

  public deuxJoueursPresents(){
    return (this.nomJoueur2.length === 0);
  }

}
