import { Router } from '@angular/router';
import { NgForm } from '@angular/forms/src/directives';
import { Component } from '@angular/core';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent {

  constructor(private router: Router) {}

  private administrateurChoisie: boolean;
  private joueurChoisie: boolean;

  public clickerAdmin(): void {
    this.joueurChoisie = false;
    this.administrateurChoisie = true;
  }

  public clickerJoueur(): void {
    this.administrateurChoisie = false;
    this.joueurChoisie = true;
  }

  public soummetre(form: NgForm): void {
    this.router.navigateByUrl('/listePiste');
    console.log(form.value);
  }
}
