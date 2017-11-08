import { Router } from '@angular/router';
import { NgForm } from '@angular/forms/src/directives';
import { Score } from './Score.model';
import { TableauScoreService } from './tableauScoreService.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-tableauscore-component',
    templateUrl: './tableauScore.component.html',
    styleUrls: ['./tableauScore.component.css']
})

export class TableauScoreComponent implements OnInit, OnDestroy {


    public temps: Score[];
    public afficher: boolean;
    public meilleurTemps: string;

    constructor(private tableauScoreService: TableauScoreService, private router: Router) {
    }

    public ngOnInit(): void {
        this.temps = this.tableauScoreService.piste.meilleursTemps;
        this.tableauScoreService.cinqMeilleurTemps(this.temps);
        if (this.tableauScoreService.temps) {
            this.meilleurTemps = this.tableauScoreService.temps;
            this.afficher = true;
        }
    }

    public soummettre(f: NgForm): void {
        const nouveauScore = new Score(f.value.nom, this.meilleurTemps);
        this.tableauScoreService.mettreAjourTableauMeilleurTemps(nouveauScore)
            .then(message => console.log(message))
            .catch(erreur => console.error(erreur));
        this.afficher = false;
        this.temps = this.tableauScoreService.piste.meilleursTemps;
    }

    public ngOnDestroy(): void {
        this.temps = null;
    }

}
