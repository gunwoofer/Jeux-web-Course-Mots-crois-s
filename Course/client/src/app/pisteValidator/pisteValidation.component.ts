import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Component, Input } from '@angular/core';

import { Piste } from '../piste/piste.model';
import { PisteService } from './../piste/piste.service';
import { RenderService } from '../renderService/render.service';

@Component({
    selector: 'app-pistevalidator-component',
    templateUrl: './pisteValidation.component.html',
    styleUrls: ['./pisteValidation.component.css']
})

export class PisteValidationComponent {
    constructor(private pisteService: PisteService, private renderService: RenderService) { }

    @Input() public pisteAmodifier: Piste;
    public display: boolean;
    public buttonText = 'Sauvegarder circuit';

    public onSubmit(form: NgForm): void {
        const listepositions: THREE.Vector3[] = [];
        Object.assign(listepositions, this.renderService.obtenirPositions());
        if (this.pisteAmodifier) {
            this.modification(this.pisteAmodifier, form, listepositions);
        } else {
            this.creerPiste(form, listepositions);
        }
        this.renderService.reinitialiserScene();
        form.resetForm();
    }
    public onClick(): void {
        this.display = !this.display;
    }

    private modification(piste: Piste, form: NgForm, listePositions: THREE.Vector3[]): void {
        if (piste.nom === form.value.nomPiste) {
            this.modifierPiste(piste, form, listePositions);
        } else {
            this.creerPiste(form, listePositions);
        }
    }

    private creerPiste(form: NgForm, listePositions: THREE.Vector3[]): void {
        const piste = new Piste(form.value.nomPiste, form.value.typeCourse, form.value.description, listePositions);
        console.log(piste);
        this.pisteService.ajouterPiste(piste)
            .then(
            donnee => console.log(donnee)
            );
    }

    private modifierPiste(piste: Piste, form: NgForm, listePositions: THREE.Vector3[]): void {
        piste.modifierAttribut(form, listePositions);
        this.pisteService.mettreAjourPiste(piste)
            .subscribe(
            donnee => console.log(donnee),
            erreur => console.error(erreur)
            );
    }
}
