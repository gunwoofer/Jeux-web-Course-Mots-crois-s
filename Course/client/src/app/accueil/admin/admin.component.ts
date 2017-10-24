import { UtilisateurService } from '../utilisateur.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms/src/directives';
import { Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {

  constructor(private router: Router, private location: Location, private utilisateurService: UtilisateurService) {}

  public revenirEnArrier(): void {
    this.location.back();
  }

  public soummetre(f: NgForm): void {
    this.utilisateurService.isAdmin = true;
    this.router.navigateByUrl('/listePiste');
  }
}
