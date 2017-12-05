import { TraitementDonneTableau } from './traitementDonneTableau';
import { NgForm } from '@angular/forms/src/directives';
import { Score } from './score.model';
import { TableauScoreService } from './tableauScoreService.service';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-tableauscore-component',
    templateUrl: './tableauScore.component.html',
    styleUrls: ['./tableauScore.component.css']
})

export class TableauScoreComponent implements OnInit, OnDestroy {


    public temps: Score[];
    public afficher: boolean;
    private finPartie: boolean;
    private finCourse: boolean;
    private meilleurTemps: string;
    private resultatPartie: boolean;
    private traitementDonnee = new TraitementDonneTableau();

    constructor(private tableauScoreService: TableauScoreService) {
    }

    public ngOnInit(): void {
        this.temps = this.tableauScoreService.piste.meilleursTemps;
        this.finPartie = this.tableauScoreService.finPartie;
        this.finCourse = this.tableauScoreService.finCourse;
        this.traitementDonnee.cinqMeilleurTemps(this.temps);
        if (this.finPartie) {
            this.temps = this.tableauScoreService.produireTableauResultat();
        } else if (!this.finPartie && this.finCourse) {
            this.afficher = true;
        }
    }

    public soummettre(f: NgForm): void {
        this.tableauScoreService.mettreAjourTableauMeilleurTemps(new Score(f.value.nom,
            Math.floor(this.tableauScoreService.temps).toString()))
            .then(message => console.log(message))
            .catch(erreur => console.error(erreur));
        this.temps = this.tableauScoreService.piste.meilleursTemps;
        this.tableauScoreService.finCourse = false;
    }

    public ngOnDestroy(): void {
        this.temps = null;
    }

}
