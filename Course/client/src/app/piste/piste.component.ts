import { TableauScoreService } from './../tableauScore/tableauScoreService.service';
import { Piste } from './piste.model';
import { Component, Input } from '@angular/core';

import { PisteService } from './piste.service';

@Component({
  selector: 'app-piste-component',
  templateUrl: './piste.component.html',
  styleUrls: ['./piste.component.css']
})

export class PisteComponent {
  @Input() public piste: Piste;
  @Input() public admin: boolean;
  public display = false;
  public score = false;
  public afficherConfiguration = false;

  constructor(private pisteService: PisteService, private tableauScoreService: TableauScoreService) { }

  public editer(): void {
    this.pisteService.modifierPiste(this.piste);
  }

  public supprimer(): void {
    this.pisteService.supprimerListePiste(this.piste)
      .then(message => console.log(message))
      .catch(erreur => console.error(erreur));
  }

  public surClick(): void {
    this.display = !this.display;
    this.assignerService();
  }

  public montrerLesScores(): void {
    this.score = !this.score;
  }

  public configurationPartie(): void {
    this.afficherConfiguration = !this.afficherConfiguration;
    this.assignerService();
  }

  public assignerService(): void {
    this.tableauScoreService.piste = this.piste;
  }
}
