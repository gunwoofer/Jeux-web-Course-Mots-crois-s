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

    public afficher: boolean;
    public temps: Score[];
    public finCourse: boolean;

    private finPartie: boolean;
    private meilleurTemps: string;
    private traitementDonnee = new TraitementDonneTableau();

    constructor(private tableauScoreService: TableauScoreService) {
    }

    public ngOnInit(): void {
        this.temps = this.tableauScoreService.piste.meilleursTemps;
        this.finPartie = this.tableauScoreService.finPartie;
        this.traitementDonnee.cinqMeilleurTemps(this.temps);
        if (this.finPartie) {
            this.temps = this.tableauScoreService.produireTableauResultat();
            this.afficher = true;
        }
        if (this.tableauScoreService.temps) {
            this.meilleurTemps = Math.floor(this.tableauScoreService.temps).toString();
            this.afficher = false;
            this.finCourse = true;
        }
    }

    public soummettre(f: NgForm): void {
        this.tableauScoreService.mettreAjourTableauMeilleurTemps(new Score(f.value.nom, this.meilleurTemps))
            .then(message => console.log(message))
            .catch(erreur => console.error(erreur));
        this.afficher = false;
        this.temps = this.tableauScoreService.piste.meilleursTemps;
    }

    public ngOnDestroy(): void {
        this.temps = null;
    }

}
