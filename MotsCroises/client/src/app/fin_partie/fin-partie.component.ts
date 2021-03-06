import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameViewService } from '../game_view/game-view.service';

@Component({
    selector: 'app-finpartie-component',
    templateUrl: './fin-partie.component.html',
    styleUrls: ['./fin-partie.component.css']
})

export class FinPartieComponent {
    public chargementPartie: boolean;

    constructor(private router: Router, private gameViewService: GameViewService) {
        this.chargementPartie = false;
    }

    public retourMenuPrincipal(): void {
        this.router.navigate(['']);
    }

    public recommencerPartie(): void {
        this.gameViewService.recommencerPartie();
        this.chargementPartie = true;
    }
}
