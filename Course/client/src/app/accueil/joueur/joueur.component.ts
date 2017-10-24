import { UtilisateurService } from '../utilisateur.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms/src/directives';
import { Component } from '@angular/core';

@Component({
  selector: 'app-joueur',
  templateUrl: './joueur.component.html',
  styleUrls: ['./joueur.component.css']
})
export class JoueurComponent {
  constructor(private router: Router, private location: Location, private utilisateurService: UtilisateurService) {}

    public revenirEnArriere(): void {
      this.location.back();
    }

    public soummetre(f: NgForm): void {
      this.utilisateurService.isAdmin = false;
      this.router.navigateByUrl('/listePiste');
    }
}
