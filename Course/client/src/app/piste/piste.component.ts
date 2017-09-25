import { Piste } from './piste.model';
import { Component, Input } from '@angular/core';
import { PisteService } from './piste.service';

@Component({
  selector: 'app-piste-component',
  templateUrl: './piste.component.html',
  styleUrls: ['./piste.component.css']
})

export class PisteComponent {
  constructor(private pisteService: PisteService) { }

  @Input() private piste: Piste;
  private display = false;

  private onEdit() {
    this.pisteService.modifierPiste(this.piste);
  }

  private Delete() {
    this.pisteService.supprimerListePiste(this.piste);
  }

  private onClick() {
    this.display = !this.display;
  }
}
