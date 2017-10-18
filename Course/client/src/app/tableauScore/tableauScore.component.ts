import { Component, Input } from '@angular/core';
import { TableauScoreService } from './tableauScoreService.service';

@Component({
    selector: 'app-tableauscore-component',
    templateUrl: './tableauScore.component.html',
    styleUrls: ['./tableauScore.component.css']
})

export class TableauScoreComponent {

    @Input() public temps: number[];

    constructor (tableauScoreService: TableauScoreService) {}
}
