import { FIN_PARTIE } from './../constant';
import { Router } from '@angular/router';
import { RatingService } from './rating.service';
import { Component, OnInit } from '@angular/core';

import { TableauScoreService } from '../tableauScore/tableauScoreService.service';
import { MusiqueService } from './../musique/musique.service';


@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.css']
})

export class RatingComponent implements OnInit {

    public veutVoter: boolean;
    public affichage: boolean;
    public ratingMoyen: number;

    constructor(private ratingService: RatingService, private router: Router, private musiqueService: MusiqueService,
        private tableauScoreSevice: TableauScoreService) { }

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
        this.changementDeroutage();
    }

    public onClick(): void {
        this.veutVoter = false;
        this.changementDeroutage();
    }

    public onClick1(): void {
        this.veutVoter = true;
    }

    private changementDeroutage(): void {
        this.router.navigateByUrl(FIN_PARTIE);
        this.tableauScoreSevice.finPartie = false;
    }

}
