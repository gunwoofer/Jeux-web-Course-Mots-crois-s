import { RenderService } from './../renderService/render.service';
import { Piste } from './piste.model';
import { Component, Input } from '@angular/core';
import { PisteService } from './piste.service';

@Component({
  selector: 'app-piste-component',
  templateUrl: './piste.component.html',
  styleUrls: ['./piste.component.css']
})

export class PisteComponent {
  constructor(private pisteService: PisteService, private renderService: RenderService) { }

  @Input() private piste: Piste;
  private display = false;
  private score = false;

  private onEdit() {
    this.renderService.chargerPiste(this.piste.listepositions);
  }

  private onDelete() {
    this.pisteService.supprimerListePiste(this.piste)
      .then(message => console.log(message))
      .catch(erreur => console.error(erreur));
  }

  private onClick() {
    this.display = !this.display;
  }

  private montrerLesScores() {
    this.score = !this.score;
  }

  private commencerPartie() {
    this.pisteService.commencerPartie(this.piste);
  }
}
