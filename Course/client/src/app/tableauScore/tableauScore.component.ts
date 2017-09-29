import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tableauscore-component',
    templateUrl: './tableauScore.component.html',
    styleUrls: ['./tableauScore.component.css']
})

export class TableauScoreComponent {
    constructor () {}

    @Input() private temps: number[];
    /*public afficherTableauDesScores() {

    }*/
}
