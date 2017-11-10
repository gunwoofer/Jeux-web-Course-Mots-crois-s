import { MusiqueService } from './../musique/musique.service';
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

    constructor(private ratingService: RatingService, private router: Router, private tableauScoreService: TableauScoreService,
                private musiqueService: MusiqueService) { }

    public ngOnInit(): void {
        this.affichage = true;
        if (!this.musiqueService.musique.thematique) {
            this.musiqueService.musique.arreterMusique();
            this.musiqueService.musique.lancerMusiqueThematique();
        }
    }
    public rating(event): void {
        this.ratingService.mettreAjourRating(event.target.value)
            .then(message => console.log(message))
            .catch(erreur => console.error(erreur));
        this.affichage = false;
        this.router.navigateByUrl('/finPartie');
    }

    public onClick(): void {
        this.veutVoter = false;
        this.router.navigateByUrl('/finPartie');
    }

    public onClick1(): void {
        this.veutVoter = true;
    }

}
