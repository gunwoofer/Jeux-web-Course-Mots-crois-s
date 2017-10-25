import { Administrateur } from './admin.model';
import { UtilisateurService } from '../utilisateur.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms/src/directives';
import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent {

  constructor(private router: Router, private utilisateurService: UtilisateurService) { }

  public soummetre(form: NgForm): void {
    const admin = new Administrateur(form.value.userName, form.value.nom, form.value.prenom, form.value.email, form.value.motDePasse);
    this.utilisateurService.ajouterAdministrateur(admin)
      .then(
        donnee => console.log(donnee)
      );
    this.router.navigateByUrl('/admin');
  }

}
