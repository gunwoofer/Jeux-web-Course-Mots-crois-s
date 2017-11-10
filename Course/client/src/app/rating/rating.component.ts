import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
import { Router } from '@angular/router';
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
    public ratingMoyen: number;

    constructor(private ratingService: RatingService, private router: Router, private tableauScoreService: TableauScoreService) { }

    public ngOnInit(): void {
        this.affichage = true;
    }
    public rating(event): void {
        this.ratingService.mettreAjourRating(event.target.value)
            .then(message => console.log(message))
            .catch(erreur => console.error(erreur));
        this.affichage = false;
        this.router.navigateByUrl('/finPartie');
        this.tableauScoreService.temps = '3min 20s';
    }

    public onClick() {
        this.veutVoter = false;
    }

    public onClick1() {
        this.veutVoter = true;
    }

}
