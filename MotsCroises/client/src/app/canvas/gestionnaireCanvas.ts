import { SpecificationPartie } from '../../../../commun/specificationPartie';
import { GameViewService } from '../game_view/game-view.service';
import { IndiceMot } from '../indice/indiceMot';
import { ElementRef } from '@angular/core';
import { TimerService } from '../game_view/timer.service';
import { IndiceService } from '../game_view/indice.service';
import { DessinCanvasService } from './dessinCanvasService';

const COULEUR_JOUEUR_1 = '#DD0000';
const COULEUR_JOUEUR_2 = '#3366DD';
const COULEUR_JOUEUR_COURRANT = '#2baa87';
const TOUCHE_BARRE_ESPACE = 'Backspace';

const ALERTE_SECLECTIONNEZ_INDICE = 'Selectionner  d\'abord un indice svp';
const ALERTE_TAILLE_MAXIMALE = 'Taille maximale du mot atteinte';
const ALERTE_TOUCHE_INVALIDE = 'Touche non valide';

export class CanvasService {
    public motEcrit = '';
    public indice: IndiceMot;
    public indiceAdversaire: IndiceMot;
    private canvas: any;
    private ctxCanvas: any;
    private ligneActuelle: number;
    private colonneActuelle: number;
    private specificationPartie: SpecificationPartie;

    constructor(private gameViewService: GameViewService,
                containerRef: ElementRef,
                private indiceService: IndiceService,
                private timerService: TimerService,
                private dessinCanvasService: DessinCanvasService) {
        this.obtenirCanvasJeu(containerRef);
        this.dessinCanvasService.setCanvas(this.canvas);
        this.initialise();
    }

    public actionToucheAppuyee(event: KeyboardEvent): void {
        const cleMot = event.key;
        const codeLettre = event.keyCode;
        if (this.timerService.modificationTempsServeurEnCours) {
            return;
        }
        if (!this.testIndiceSelectionne()) {
            alert(ALERTE_SECLECTIONNEZ_INDICE);
            return;
        }
        if (cleMot === TOUCHE_BARRE_ESPACE) {
            if (this.motEcrit.length === 0) {
                return;
            }
            this.reculerCaseActive(this.indice.sens);
            this.motEcrit = this.motEcrit.substring(0, this.motEcrit.length - 1);
            this.effacerLettreDansCaseActive();
        } else {
            if (!this.testCaseDisponible(this.ligneActuelle, this.colonneActuelle)) {
                alert(ALERTE_TAILLE_MAXIMALE);
                return;
            } else if (codeLettre < 65 || (codeLettre > 91 && codeLettre < 97) || codeLettre > 123) {
                alert(ALERTE_TOUCHE_INVALIDE);
                return;
            }
            this.motEcrit = this.motEcrit + cleMot.toUpperCase();
            this.ecrireLettreDansCaseActive(cleMot.toUpperCase(), COULEUR_JOUEUR_COURRANT);
            this.avancerCaseActive(this.indice.sens);
        }
        this.gameViewService.mettreAJourMotEntre(this.motEcrit);
        this.validerMotEntre();
    }

    public miseAJourIndice(indice: IndiceMot): void {
        this.motEcrit = '';
        this.indice = indice;
        if (indice) {
            this.definirCaseActive(indice.positionI, indice.positionJ);
        }
        this.rafraichirCanvas();
    }

    public testIndiceSelectionne(): boolean {
        if (!this.indice) {
            return false;
        }
        return true;
    }

    public miseAJourIndiceAdversaire(indice: IndiceMot): void {
        this.indiceAdversaire = indice;
        this.rafraichirCanvas();
    }

    public validerMotEntre(): void {
        if (this.motEcrit.length === this.indice.tailleMot) {
            this.gameViewService.testMotEntre(this.motEcrit, this.indice);
            this.dessinCanvasService.ecrireMotsTrouves(this.indiceService.indices);
        }
    }


    public obtenirCanvasJeu(containerRef: ElementRef): void {
        this.canvas = containerRef.nativeElement;
    }

    public initialise(): void {
        this.specificationPartie = this.gameViewService.getPartie();
        this.ctxCanvas = this.canvas.getContext('2d');
        this.dessinCanvasService.initialiserCanvas(this.specificationPartie, this.indiceService.indices);
        this.gererAffichageSelecteurs();
    }

    public rafraichirCanvas(): void {
        this.dessinCanvasService.rafraichirCanvas(this.specificationPartie, this.indiceService.indices);
        if (this.indice) {
            this.dessinCanvasService.ecrireMotDansGrille(
                this.motEcrit, this.indice.sens, this.indice.positionI, this.indice.positionJ, COULEUR_JOUEUR_COURRANT
            );
        }
        this.gererAffichageSelecteurs();
    }

    public motTrouveRafraichirCanvas(): void {
        this.motEcrit = '';
        this.rafraichirCanvas();
    }

    public ecrireLettreDansCaseActive(lettre: string, couleur: string): void {
        this.dessinCanvasService.ecrireLettreDansCase(lettre, this.ligneActuelle, this.colonneActuelle, couleur);
    }

    public definirCaseActive(i: number, j: number): void {
        this.ligneActuelle = i;
        this.colonneActuelle = j;
    }

    public avancerCaseActive(sens): void {
        sens === 0 ? this.ligneActuelle++ : this.colonneActuelle++;
    }

    public reculerCaseActive(sens): void {
        sens === 0 ? this.ligneActuelle-- : this.colonneActuelle--;
    }

    public effacerLettreDansCaseActive(): void {
        this.dessinCanvasService.effacerLettreDansCase(this.ligneActuelle, this.colonneActuelle);
        this.rafraichirCanvas();
    }

    public testCaseDisponible(i: number, j: number): boolean {
        if (this.indice.sens === 0) {
            return i < this.indice.positionI + this.indice.tailleMot;
        } else {
            return j < this.indice.positionJ + this.indice.tailleMot;
        }
    }

    private afficherSelecteurAdversaireSurGrille(): void {
        if (this.indiceAdversaire) {
            this.dessinCanvasService.afficherSelecteurMotSurGrille(this.indiceAdversaire.tailleMot, this.indiceAdversaire.sens,
                this.indiceAdversaire.positionI, this.indiceAdversaire.positionJ, COULEUR_JOUEUR_2);
        }
    }

    private afficherDoubleSelecteur(): void {
        this.dessinCanvasService.afficherSelecteurMotSurGrille(this.indiceAdversaire.tailleMot, this.indiceAdversaire.sens,
            this.indiceAdversaire.positionI, this.indiceAdversaire.positionJ, COULEUR_JOUEUR_1);
        this.dessinCanvasService.afficherSelecteurMotSurGrille(this.indiceAdversaire.tailleMot, this.indiceAdversaire.sens,
            this.indiceAdversaire.positionI, this.indiceAdversaire.positionJ, COULEUR_JOUEUR_2, true);
    }

    private gererAffichageSelecteurs(): void {
        if (this.indice) {
            this.dessinCanvasService.afficherSelecteurMotSurGrille(this.indice.tailleMot, this.indice.sens,
                this.indice.positionI, this.indice.positionJ, COULEUR_JOUEUR_1);
        }
        if (this.indiceAdversaire) {
            this.afficherSelecteurAdversaireSurGrille();
        } else {
            return;
        }
        if (this.indice && this.indiceAdversaire && this.indice.guidIndice === this.indiceAdversaire.guidIndice) {
            this.afficherDoubleSelecteur();
        }
    }
}
