import { ADMINISTRATION } from './../../../constant';
import { ModificationForm } from './modificationModel';
import { UtilisateurService } from '../../utilisateur.service';
import { NgForm } from '@angular/forms/src/directives';
import { Router } from '@angular/router';
import { Component } from '@angular/core';

@Component({
    selector: 'app-modificationmotpasse',
    templateUrl: './modificationMotDePasse.component.html',
    styleUrls: ['./modificationMotDePasse.component.css']
})
export class ModificationMotDePasseComponent {

    constructor(private router: Router, private utilisateurService: UtilisateurService) { }

    public soummetre(form: NgForm): void {
        this.utilisateurService.modifierMotDePasse(new ModificationForm(form))
                                .then(donnee => {
                                    if (donnee.message) {
                                        alert(donnee.message);
                                        this.router.navigateByUrl(ADMINISTRATION);
                                    } else {
                                        alert(donnee.error.message);
                                    }
                                });
    }
}
