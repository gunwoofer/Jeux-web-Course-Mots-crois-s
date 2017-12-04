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

    private finPartie: boolean;
    private meilleurTemps: string;
    private resultatPartie: boolean;
    private traitementDonnee = new TraitementDonneTableau();

    constructor(private tableauScoreService: TableauScoreService) {
    }

    public ngOnInit(): void {
        this.temps = this.tableauScoreService.piste.meilleursTemps;
        this.traitementDonnee.cinqMeilleurTemps(this.temps);

        if (this.tableauScoreService.finPartie) {
            this.temps = this.tableauScoreService.produireTableauResultat();
        }

        if (this.tableauScoreService.temps) {
            this.meilleurTemps = Math.floor(this.tableauScoreService.temps).toString();
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
