import { AfterViewInit, Component, Input } from '@angular/core';
import { GameViewService } from '../game_view/game-view.service';
import { Joueur } from '../../../../commun/joueur';
import { TimerService } from '../game_view/timer.service';
import { IndiceService } from '../game_view/indice.service';
import { TypePartie } from '../../../../commun/typePartie';
import { Niveau } from '../../../../commun/niveau';

export const TEMPS_RESTANT_INITIAL = 300;
export const FREQUENCE_DECREMENTATION_TEMPS_EN_MS = 1000;
export const FREQUENCE_INTERROGATION_SERVEUR_TEMPS_EN_MS = 10000;
export const DUREE_GRILLE = 3000000;

@Component({
    selector: 'app-infos-jeu-view-component',
    templateUrl: './infos-jeu-view.component.html',
    styleUrls: ['./infos-jeu-view.component.css']
})

export class InfosJeuViewComponent implements AfterViewInit {
    @Input()
    public nbJoueurs: string;
    public motEnCoursJ1: string;
    public tempsRestant = TEMPS_RESTANT_INITIAL;
    public tempsFin: number;
    public joueur: Joueur;
    public joueur2: Joueur;
    public cheatModeVisible = false;
    public tempsRestantAEnvoyer: number;
    public typeDePartie: string;
    public niveauPartie: string;
    private intervalFunction: any;
    private intervalFunctionServer: any;

    constructor(private gameViewService: GameViewService,
                private timerService: TimerService,
                private indiceService: IndiceService) {
        this.gameViewService.motEcrit$.subscribe(nouveauMot => {
            this.motEnCoursJ1 = nouveauMot;
        });
        this.timerService.modifierTempsRestant$.subscribe(nouveauTemps => {
            this.tempsRestant = Math.round(nouveauTemps / 1000);
        });
        this.joueur = this.gameViewService.joueur;
        this.joueur2 = this.gameViewService.joueur2;
        this.typeDePartie = TypePartie[this.gameViewService.specificationPartie.typePartie];
        this.niveauPartie = Niveau[this.gameViewService.specificationPartie.niveau];
    }

    public ngAfterViewInit(): void {
        this.recommencerTimer();
        this.demarrerFonctionIntervalTemps();
    }

    public recupererMotsCheatMode(): void {
        this.indiceService.demanderMotsComplets();
    }

    public afficherCheatMode(): void {
        this.cheatModeVisible = !this.cheatModeVisible;
    }

    public stopperIntervalFonction(): void {
        clearInterval(this.intervalFunction);
        clearInterval(this.intervalFunctionServer);
    }

    public envoyerTemps(): void {
        this.timerService.modifierTempsServeur(this.tempsRestantAEnvoyer * 1000);
    }

    public activerEcritureTempsCheatMode(): void {
        this.timerService.activerModificationTempsServeur();
    }

    private recommencerTimer() {
        this.tempsFin = Date.now() + DUREE_GRILLE;
    }

    private demarrerFonctionIntervalTemps() {
        this.intervalFunction = setInterval(() => {
            this.MAJTemps();
        }, FREQUENCE_DECREMENTATION_TEMPS_EN_MS);
        this.intervalFunctionServer = setInterval(() => {
            this.MAJTempsServer();
        }, FREQUENCE_INTERROGATION_SERVEUR_TEMPS_EN_MS);
    }

    private MAJTemps() {
        this.tempsRestant -= 1;
        if (this.tempsRestant < 0) {
            this.gameViewService.partieTermineeFauteDeTemps();
        }
    }

    private MAJTempsServer(): void {
        this.timerService.demanderTempsPartie();
    }
}
