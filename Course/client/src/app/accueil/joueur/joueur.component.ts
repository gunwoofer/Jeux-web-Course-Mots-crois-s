import { UtilisateurService } from '../utilisateur.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms/src/directives';
import { Component } from '@angular/core';

@Component({
  selector: 'app-joueur',
  templateUrl: './joueur.component.html',
  styleUrls: ['./joueur.component.css']
})
export class JoueurComponent {
  constructor(private router: Router, private utilisateurService: UtilisateurService) {}

    public revenirEnArriere(): void {
      this.router.navigateByUrl('/accueil');
    }

    public soummetre(f: NgForm): void {
      this.utilisateurService.isAdmin = false;
      this.router.navigateByUrl('/listePiste');
    }
}
