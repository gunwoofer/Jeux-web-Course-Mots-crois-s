import { Administrateur } from './../admin';
import { UtilisateurService } from './../../utilisateur.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms/src/directives';
import { Component, OnInit } from '@angular/core';
import { LISTE_PISTE, MOT_DE_PASSE_OUBLIE, URL_INSCRIPTION, INSCRIPTION } from '../../../constant';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {

    // Voir utilisation dans connexion.component.html
    public nbAdmin: number;

    constructor(private router: Router, private utilisateurService: UtilisateurService) { }

    public soummetre(form: NgForm): void {
        const admin = new Administrateur(form);

        this.utilisateurService.seConnecter(admin)
                                .then(reponse => {
                                    if (reponse.message) {
                                        alert(reponse.message);
                                        this.utilisateurService.isAdmin = true;
                                        this.router.navigateByUrl(LISTE_PISTE);
                                    } else {
                                        alert(reponse.error.message);
                                    }
                                });
    }

    public sinscrire(): void {
        this.router.navigateByUrl(INSCRIPTION);
    }

    public motDepasseOublie(): void {
        this.router.navigateByUrl(MOT_DE_PASSE_OUBLIE);
    }

    public ngOnInit(): void {
        this.utilisateurService.nombreAdmin().then(reponse => this.nbAdmin = reponse.objet);
    }
}
