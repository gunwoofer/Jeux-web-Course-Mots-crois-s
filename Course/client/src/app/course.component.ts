import { Component } from '@angular/core';


@Component({
    selector: 'app-course',
    template: `
    <header class="row">
        <br>
        <nav class="col-md-8 col-md-offset-2">
            <ul class="nav nav-pills">
                <li routerLinkActive="active"><a [routerLink]="['/createurPiste']">Createur de piste</a></li>
                <li routerLinkActive="active"><a [routerLink]="['/listePiste']">Liste de Piste</a></li>
            </ul>
        </nav>
    </header>
    `,
})

export class CourseComponent {

}
