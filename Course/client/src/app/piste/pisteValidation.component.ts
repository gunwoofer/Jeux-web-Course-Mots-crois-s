import { NgForm } from '@angular/forms';
import { Component, Input } from '@angular/core';

import { Piste } from './piste.model';
import { RenderService } from './../createurPiste/render.service';

@Component({
    selector : 'app-pistevalidator-component',
    templateUrl : './pisteValidation.component.html',
})

export class PisteValidationComponent {

    @Input() private points: THREE.Points[];
    @Input() private lignes: THREE.Line[];

    private onSubmit(form: NgForm) {
        const piste = new Piste(form.value.nomPiste, form.value.typeCourse, form.value.description, this.points);
        console.log(piste);
    }
}
