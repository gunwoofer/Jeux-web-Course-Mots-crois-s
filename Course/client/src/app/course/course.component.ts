import { Component } from '@angular/core';
import { RenderService } from './../renderService/render.service';


@Component({
    selector: 'app-course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})

export class CourseComponent {

    constructor(private renderService: RenderService) {}

    public surClick(): void {
        this.renderService.reinitialiserScene();
    }

}
