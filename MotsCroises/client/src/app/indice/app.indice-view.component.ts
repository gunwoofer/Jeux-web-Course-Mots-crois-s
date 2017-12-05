import { Component, OnInit } from '@angular/core';
import { IndiceMot } from './indiceMot';
import { TimerService } from '../game_view/timer.service';
import { IndiceService } from '../game_view/indice.service';

@Component({
    selector: 'app-indice-view-component',
    templateUrl: './indice-view.component.html',
    styleUrls: ['./indice-view.component.css'],
})
export class IndiceViewComponent implements OnInit {
    public indices: IndiceMot[];
    public selectedIndice: IndiceMot;

    constructor(private timerService: TimerService,
                private indiceService: IndiceService) {
        this.timerService.modificationTempsCheatMode$.subscribe(() => {
            this.annulerSelectionIndice();
        });
    }

    public onSelect(indice: IndiceMot, event: Event): void {
        event.stopPropagation();
        if (indice.motTrouve) {
            return;
        }
        this.selectedIndice = indice;
        this.timerService.desactiverModificationTempsServeur();
        this.indiceService.afficherSelectionIndice(indice);
    }

    public annulerSelectionIndice() {
        this.selectedIndice = null;
        this.indiceService.afficherSelectionIndice(null);
    }

    public ngOnInit(): void {
        this.indices = [];
        this.indices = this.indiceService.indices;
    }

}
