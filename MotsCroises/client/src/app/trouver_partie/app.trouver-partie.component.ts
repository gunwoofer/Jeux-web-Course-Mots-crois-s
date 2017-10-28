import {Component} from '@angular/core';
import {GameViewService} from '../game_view/game-view.service';
import {VuePartieEnCours} from '../../../../commun/VuePartieEnCours';


@Component({
  selector: 'app-trouver-partie-component',
  templateUrl: './trouver-partie.component.html',
  styleUrls: ['./trouver-partie.component.css']
})

export class TrouverPartieComponent {
  public nomJoueur = '';
  public test = true;
  public partieSelectionne: VuePartieEnCours;


  constructor(private gameViewService: GameViewService) {
  }

  public listeVuePartie: VuePartieEnCours[] = [
    {
      'guidPartie': '1ced6819-ac4c-40ac-8abb-68cab347f29c',
      'nomJoueurHote': 'Alma King',
      'niveau': 1
    },
    {
      'guidPartie': '988aa7d9-0c2e-4539-8ba4-7a8d721ca931',
      'nomJoueurHote': 'Elizabeth Jefferson',
      'niveau': 1
    },
    {
      'guidPartie': 'dd4c96fb-b47d-435c-bd5a-48deab52ac57',
      'nomJoueurHote': 'Hopper Perez',
      'niveau': 1
    },
    {
      'guidPartie': '6a2e2967-0239-48bb-aef6-147bb38d44a1',
      'nomJoueurHote': 'Lilia Dean',
      'niveau': 1
    },
    {
      'guidPartie': '65f2fe25-7bbc-440b-8605-6ac32aa86318',
      'nomJoueurHote': 'Beach Anthony',
      'niveau': 1
    }
  ];

  public setPartieSelectionne(partie) {
    this.partieSelectionne = partie;
  }

  public nomJoueurValable() {
    return (this.nomJoueur.length === 0);
  }

}
