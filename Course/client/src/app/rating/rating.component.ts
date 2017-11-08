import { RatingService } from './rating.service';
import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.css']
})

export class RatingComponent implements OnInit {

    public veutVoter: boolean;
    public affichage: boolean;

    constructor(private ratingService: RatingService) { }

    public ngOnInit(): void {
        this.affichage = false;
    }

    public rating(event): void {
        console.log(event.target.value);
        this.ratingService.rating = event.target.value;
    }

    public onClick() {
        this.veutVoter = false;
    }

    public onClick1() {
        this.veutVoter = true;
    }

}
