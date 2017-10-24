import { NgForm } from '@angular/forms/src/directives';
import { Component } from '@angular/core';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.component.html',
  styleUrls: ['./authentification.component.css']
})
export class AuthentificationComponent {

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
    console.log(form.value);
  }
}
