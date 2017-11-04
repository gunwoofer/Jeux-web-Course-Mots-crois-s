import { TableauScoreService } from './tableauScoreService.service';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tableauscore-component',
    templateUrl: './tableauScore.component.html',
    styleUrls: ['./tableauScore.component.css']
})

export class TableauScoreComponent {

    public temps: string[];

    constructor(private tableauScoreService: TableauScoreService) {
        this.temps = this.tableauScoreService.meilleurTemps;
    }

}
