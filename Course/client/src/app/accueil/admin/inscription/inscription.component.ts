import { ADMINISTRATION } from './../../../constant';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms/src/directives';
import { Component } from '@angular/core';

import { UtilisateurService } from './../../utilisateur.service';
import { Administrateur } from './../admin.model';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {

  constructor(private router: Router, private utilisateurService: UtilisateurService) { }

  public afficherSucces: boolean;

  public soummetre(form: NgForm): void {
    const admin = new Administrateur(form.value.email, form.value.motDePasse, form.value.userName, form.value.nom, form.value.prenom);
    this.utilisateurService.sInscrire(admin)
      .then(donnee => { this.afficherSucces = donnee ? true : false; });
  }

  public changeRoutage(): void {
    this.router.navigateByUrl(ADMINISTRATION);
  }

}
