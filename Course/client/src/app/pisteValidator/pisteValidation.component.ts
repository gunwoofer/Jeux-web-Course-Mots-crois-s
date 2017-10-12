import { Http } from '@angular/http';
import { RenderService } from '../renderService/render.service';
import { NgForm } from '@angular/forms';
import { Component, Input } from '@angular/core';

import { Piste } from '../piste/piste.model';
import { PisteService } from './../piste/piste.service';

@Component({
    selector: 'app-pistevalidator-component',
    templateUrl: './pisteValidation.component.html',
    styleUrls: ['./pisteValidation.component.css']
})

export class PisteValidationComponent {
    constructor(private pisteService: PisteService, private renderService: RenderService) { }

    @Input() private points: THREE.Points[];
    @Input() private pisteAmodifier: Piste;
    private display: boolean;
    private buttonText = 'Sauvegarder circuit';
    // private butrtonText = 'Modifier circuit';

    private onSubmit(form: NgForm): void {
        const listepositions: any[] = [];
        Object.assign(listepositions, this.renderService.obtenirPositions());
        if (this.pisteAmodifier) {
            this.modification(this.pisteAmodifier, form, listepositions);
        } else {
            this.creerPiste(form, listepositions);
        }
        this.renderService.reinitialiserScene();
        form.resetForm();
    }
    private onClick(): void {
        this.display = !this.display;
    }

    private modification(piste: Piste, form: NgForm, listePositions: any[]): void {
        if (piste.nom === form.value.nomPiste) {
            this.modifierPiste(piste, form, listePositions);
        } else {
            this.creerPiste(form, listePositions);
        }
    }

    private creerPiste(form: NgForm, listePositions: any[]): void {
        const piste = new Piste(form.value.nomPiste, form.value.typeCourse, form.value.description, listePositions);
        this.pisteService.ajouterPiste(piste)
            .subscribe(
            donnee => console.log(donnee),
            erreur => console.error(erreur)
            );
    }

    private modifierPiste(piste: Piste, form: NgForm, listePositions: any[]): void {
        piste.modifierAttribut(form, listePositions);
        this.pisteService.mettreAjourPiste(piste)
            .subscribe(
            donnee => console.log(donnee),
            erreur => console.error(erreur)
            );
    }
}
