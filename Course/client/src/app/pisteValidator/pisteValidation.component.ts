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

    constructor(private pisteService: PisteService) {}

    @Input() private points: THREE.Points[];
    @Input() private lignes: THREE.Line[];

    private display: boolean;

    private onSubmit(form: NgForm): void {
        const piste = new Piste(form.value.nomPiste, form.value.typeCourse, form.value.description, this.points);
        alert('La piste ' + piste.obtenirNom() + ' a été créée.');
        this.pisteService.ajouterPiste(piste);
        form.resetForm();
    }

    private onClick(): void {
        this.display = !this.display;
    }
}
