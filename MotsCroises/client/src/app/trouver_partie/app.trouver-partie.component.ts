import {Component, OnInit} from '@angular/core';
import {GameViewService} from '../game_view/game-view.service';
import {VuePartieEnCours} from '../../../../commun/VuePartieEnCours';
import {EnumUtilitaires} from '../../../../commun/EnumUtilitaires';
import {Niveau} from '../../../../commun/Niveau';
import { Joueur } from '../../../../commun/Joueur';


@Component({
  selector: 'app-trouver-partie-component',
  templateUrl: './trouver-partie.component.html',
  styleUrls: ['./trouver-partie.component.css']
})

export class TrouverPartieComponent implements OnInit {
  public listeVuePartie: VuePartieEnCours[] = [ ];

  public nomJoueur = '';
  public test = true;
  public partieSelectionne: VuePartieEnCours;
  private joueur: Joueur = new Joueur();


  constructor(private gameViewService: GameViewService) {
  }

  public ngOnInit(): void {
    this.gameViewService.demanderListePartieEnAttente(this.listeVuePartie);
  }

  public setPartieSelectionne(partie) {
    this.partieSelectionne = partie;
  }

  public nomJoueurValable() {
    return (this.nomJoueur.length === 0);
  }

  public retournerNiveau(partie) {
    return EnumUtilitaires.chaine_de_caractere_depuis_enum(Niveau, partie.niveau);
  }

  public rejoindrePartie() {
    console.log('PARTIER EN TRAIN DE REJOINDRE');
    this.joueur.changerNomJoueur(this.nomJoueur);

    this.gameViewService.rejoindrePartieMultijoueur(this.partieSelectionne, this.joueur);
  }

}
