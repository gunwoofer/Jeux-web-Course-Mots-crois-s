import { Administrateur } from './../admin.model';
import { UtilisateurService } from './../../utilisateur.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms/src/directives';
import { Component, OnInit } from '@angular/core';
import { LISTE_PISTE, MOT_DE_PASSE_OUBLIE } from '../../../constant';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

  constructor(private router: Router, private utilisateurService: UtilisateurService) { }

  public nbAdmin: number;

  public revenirEnArrier(): void {
    this.router.navigateByUrl('/accueil');
  }

  public soummetre(form: NgForm): void {
    const admin = new Administrateur(form.value.email, form.value.motDePasse);

    this.utilisateurService.seConnecter(admin)
      .then(donne => {
        if (donne.message) {
          alert(donne.message);
          this.utilisateurService.isAdmin = true;
          this.router.navigateByUrl(LISTE_PISTE);
        } else {
          alert(donne.error.message);
        }
      });
  }

  public sinscrire(): void {
    this.router.navigateByUrl(LISTE_PISTE);
  }

  public motDepasseOublie(): void {
    this.router.navigateByUrl(MOT_DE_PASSE_OUBLIE);
  }

  public ngOnInit(): void {
    this.utilisateurService.nombreAdmin().then(donne => {
      this.nbAdmin = donne.objet;
    });
  }

}
