import { NgForm } from '@angular/forms';
import { Component, Input } from '@angular/core';

import { Piste } from './piste.model';
import { RenderService } from './../createurPiste/render.service';

@Component({
    selector : "app-pisteValidator",
    templateUrl : "./pisteValidation.component.html",
})

export class PisteValidationComponent {

    @Input() points : THREE.Points[];
    @Input() lignes : THREE.Line[];

    

    onSubmit(form : NgForm){
        const piste = new Piste(form.value.nomPiste,form.value.typeCourse,form.value.description,this.points,this.lignes);
        console.log(piste);
    }

    
}