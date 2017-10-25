import { UtilisateurService } from '../utilisateur.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms/src/directives';
import { Component, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor(private router: Router, private utilisateurService: UtilisateurService) { }

  public nbAdmin: number;

  public revenirEnArrier(): void {
    this.router.navigateByUrl('/accueil');
  }

  public soummetre(f: NgForm): void {
    this.utilisateurService.isAdmin = true;
    this.router.navigateByUrl('/listePiste');
  }

  public sinscrire(): void {
    this.router.navigateByUrl('/inscription');
  }

  public ngOnInit() {
    this.utilisateurService.nombreAdmin().then(donne => {
      this.nbAdmin = donne.objet;
    });
  }

}
