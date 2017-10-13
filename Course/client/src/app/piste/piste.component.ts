import { Piste } from './piste.model';
import { Component, Input } from '@angular/core';

import { PisteService } from './piste.service';
import { RenderService } from './../renderService/render.service';

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

  private editer(): void {
    this.pisteService.modifierPiste(this.piste);
  }

  private supprimer(): void {
    this.pisteService.supprimerListePiste(this.piste)
      .then(message => console.log(message))
      .catch(erreur => console.error(erreur));
  }

  private surClick(): void {
    this.display = !this.display;
  }

  private montrerLesScores(): void {
    this.score = !this.score;
  }

  private commencerPartie(): void {
    this.pisteService.commencerPartie(this.piste);
  }
}
