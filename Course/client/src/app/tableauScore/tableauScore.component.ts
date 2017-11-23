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
    public finPartie: boolean;
    public meilleurTemps: string;
    public resultatPartie: boolean;
    public traitementDonnee = new TraitementDonneTableau();

    constructor(private tableauScoreService: TableauScoreService) {
    }

    public ngOnInit(): void {
        this.temps = this.tableauScoreService.piste.meilleursTemps;
        this.traitementDonnee.cinqMeilleurTemps(this.temps);
        if (this.tableauScoreService.finPartie) {
            this.temps = this.tableauScoreService.produireTableauResultat();
        }
        if (this.tableauScoreService.temps) {
            this.meilleurTemps = this.tableauScoreService.temps.toString();
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
