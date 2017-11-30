import { LISTE_PISTE, ADMINISTRATION } from './../constant';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {

  constructor(private router: Router) { }

  public clickerAdmin(): void {
    this.router.navigateByUrl(ADMINISTRATION);
  }

  public clickerJoueur(): void {
    this.router.navigateByUrl(LISTE_PISTE);
  }
}
