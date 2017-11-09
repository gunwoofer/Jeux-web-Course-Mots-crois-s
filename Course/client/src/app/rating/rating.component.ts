import { Component } from '@angular/core';


@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.css']
})

export class RatingComponent {

    public veutVoter: boolean;

    public rating(event): void {
        console.log(event.target.value);
    }

    public onClick() {
        this.veutVoter = false;
    }

    public onClick1() {
        this.veutVoter = true;
    }

}
