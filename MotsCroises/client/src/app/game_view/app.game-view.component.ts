import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { GameViewService } from './game-view.service';
import { CanvasViewComponent } from '../canvas/app.canvas-view.component';
import { InfosJeuViewComponent } from '../infos_jeu/app.infos-jeu-view.component';
import { ChoixPartieService } from '../choix_partie/choix-partie.service';
import { IndiceService } from './indice.service';

@Component({
    selector: 'app-game-view',
    templateUrl: './game-view.component.html',
    styleUrls: ['./game-view.component.css']
})

export class GameViewComponent implements OnInit {
    public nbJoueurs: string;

    @ViewChild(CanvasViewComponent)
    private canvasViewComponent: CanvasViewComponent;

    @ViewChild(InfosJeuViewComponent)
    private infosJeuViewComponent: InfosJeuViewComponent;

    constructor(private route: ActivatedRoute,
                private gameViewService: GameViewService,
                private choixPartieService: ChoixPartieService,
                private indiceService: IndiceService,
                private router: Router) {
        this.gameViewService.specificationPartie = this.choixPartieService.specificationPartie;
        this.gameViewService.joueur = this.choixPartieService.joueur;
        this.gameViewService.joueur2 = this.choixPartieService.joueur2;
        this.indiceService.MAJIndices();
        this.indiceService.ecouterChangementSelectionMotAdversaire();
        this.ecouterEvenementsServeur();
        if (!this.testPartieExiste()) {
            this.retourAccueil();
        }
    }

    public ecouterEvenementsServeur(): void {
        this.gameViewService.ecouterRappelsServeur();
        this.gameViewService.motTrouve$.subscribe(() => {
            this.actualiserGrille();
        });
        this.gameViewService.partieTeminee$.subscribe(() => {
            this.infosJeuViewComponent.stopperIntervalFonction();
            this.allerAPartieTerminee();
        });
    }

    public ngOnInit(): void {
        this.obtenirNombreDeJoueurs();
    }

    public actualiserGrille(): void {
        this.canvasViewComponent.motTrouveActualiser();
    }

    private allerAPartieTerminee(): void {
        this.router.navigate(['/partieTerminee']);
    }

    private testPartieExiste(): boolean {
        if (this.indiceService.indices) {
            return true;
        }
        return false;
    }

    private retourAccueil(): void {
        this.router.navigate(['/']);
    }

    private obtenirNombreDeJoueurs(): void {
        this.route.paramMap
            .switchMap((params: ParamMap) => this.nbJoueurs = params.get('nbJoueurs'))
            .subscribe();
    }

}
