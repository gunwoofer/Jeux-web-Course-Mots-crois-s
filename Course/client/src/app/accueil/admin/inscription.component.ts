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

  public afficherSucces: boolean;

  public soummetre(form: NgForm): void {
    const admin = new Administrateur(form.value.email, form.value.motDePasse, form.value.userName, form.value.nom, form.value.prenom);
    this.utilisateurService.sInscrire(admin)
      .then(donne => {
        if (donne) {
          this.afficherSucces = true;
        }
      });
  }

  public changeRoutage(): void {
    this.router.navigateByUrl('/admin');
  }

}
