import { ADMINISTRATION } from './../../../constant';
import { UtilisateurService } from '../../utilisateur.service';
import { NgForm } from '@angular/forms/src/directives';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
    selector: 'app-motdepasseoublie',
    templateUrl: './motDepasseOublie.component.html',
    styleUrls: ['./motDepasseOublie.component.css']
})
export class MotDepasseOublieComponent {

    constructor(private router: Router, private utilisateurService: UtilisateurService) { }

    public soummetre(form: NgForm): void {
        const email = form.value.email;

        this.utilisateurService.recupererMotDePasse(email)
                                .then(donnee => {
                                    if (donnee.motDePasse) {
                                        alert(donnee.motDePasse);
                                        this.router.navigateByUrl(ADMINISTRATION);
                                    } else {
                                        alert(donnee.message);
                                    }
                                });

    }
}
