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
        const modiForm = new ModificationForm(form.value.email, form.value.motDePasse, form.value.NmotDePasse);
        this.utilisateurService.modifierMotDePasse(modiForm)
            .then(donne => {
                if (donne) {
                    console.log(donne);
                    this.router.navigateByUrl('/admin');
                }
            });
    }
}
