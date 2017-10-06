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
    // providers
})

export class PisteValidationComponent {

    constructor(private pisteService: PisteService, private renderService: RenderService) { }

    @Input() private points: THREE.Points[];
    @Input() private lignes: THREE.Line[];

    private display: boolean;

    private onSubmit(form: NgForm): void {
        const listepositions = [];
        Object.assign(listepositions, this.renderService.points); // Mettre chaque position de chaque point
        const piste = new Piste(form.value.nomPiste, form.value.typeCourse, form.value.description);
        alert('La piste ' + piste.nom + ' a été créée.');
        this.pisteService.ajouterPiste(piste).subscribe(
            donnee => console.log(donnee),
            erreur => console.error(erreur)
        );
        this.renderService.piste = piste; // TEST: Attribut piste de renderService
        console.log(this.renderService.piste);
        form.resetForm();
    }

    private onClick(): void {
        this.display = !this.display;
    }
}
