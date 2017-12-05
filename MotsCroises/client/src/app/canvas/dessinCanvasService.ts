import { Injectable } from '@angular/core';
import { IndiceMot } from '../indice/indiceMot';
import { SpecificationPartie } from '../../../../commun/specificationPartie';

const NOMBRE_DE_CASE = 11;
const COULEUR_NOIRE = '#000000';
const POLICE_LETTRE = '35px Arial';
const COULEUR_JOUEUR_1 = '#DD0000';

@Injectable()
export class DessinCanvasService {
    private canvas: any;
    private ctxCanvas: any;
    private largeurCase: number;
    private margeEffacement: number;
    private hauteurCase: number;

    public setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public initialiserCanvas(specificationPartie: SpecificationPartie, listeIndiceMots: IndiceMot[]): void {
        this.canvas.height = this.canvas.width;
        this.largeurCase = this.canvas.width / 11;
        this.hauteurCase = this.canvas.height / 11;
        this.margeEffacement = Math.round(this.largeurCase / 10);
        this.ctxCanvas = this.canvas.getContext('2d');
        this.dessinerLignesGrille();
        this.ecrireMotsTrouves(listeIndiceMots);
        this.dessinerCaseNoiresGrilleObtenueServeur(specificationPartie);
    }

    public rafraichirCanvas(specificationPartie: SpecificationPartie, listeIndiceMots: IndiceMot[]): void {
        this.ctxCanvas.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.dessinerLignesGrille();
        this.ecrireMotsGrilleObtenueServeur(specificationPartie);
        this.dessinerCaseNoiresGrilleObtenueServeur(specificationPartie);
        this.ecrireMotsTrouves(listeIndiceMots);
    }

    public ecrireMotsGrilleObtenueServeur(specificationPartie: SpecificationPartie): void {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.ecrireLettreDansCase(
                    specificationPartie.specificationGrilleEnCours.cases.obtenirCase(i, j).obtenirLettre(),
                    j + 1, i + 1, COULEUR_JOUEUR_1
                );
            }
        }
    }

    public dessinerLignesGrille(): void {
        this.ctxCanvas.fillStyle = COULEUR_NOIRE;
        for (let i = 1; i < NOMBRE_DE_CASE; i++) {
            this.ecrireLettreDansCase(i.toString(), i, 0, COULEUR_NOIRE);
            this.ecrireLettreDansCase(i.toString(), 0, i, COULEUR_NOIRE);
            this.ctxCanvas.fillRect(this.largeurCase * i, this.hauteurCase, 1, this.canvas.height);
            this.ctxCanvas.fillRect(this.largeurCase, this.hauteurCase * i, this.canvas.width, 1);
        }
        this.ctxCanvas.fillRect(this.largeurCase * NOMBRE_DE_CASE - 1, this.hauteurCase, 1, this.canvas.height);
        this.ctxCanvas.fillRect(this.largeurCase, this.hauteurCase * NOMBRE_DE_CASE - 1, this.canvas.width, 1);
    }

    public ecrireLettreDansCase(lettre: string, i: number, j: number, couleur: string): void {
        this.effacerLettreDansCase(i, j);
        this.ctxCanvas.font = POLICE_LETTRE;
        this.ctxCanvas.fillStyle = couleur;
        this.ctxCanvas.textAlign = 'center';
        this.ctxCanvas.textBaseline = 'middle';
        this.ctxCanvas.fillText(lettre.toUpperCase(), this.largeurCase * (i + 1 / 2), this.hauteurCase * (j + 1 / 2));
    }

    public effacerLettreDansCase(i: number, j: number): void {
        this.ctxCanvas.clearRect(this.largeurCase * i + this.margeEffacement, this.hauteurCase * j + this.margeEffacement,
            this.largeurCase - 2 * this.margeEffacement, this.hauteurCase - 2 * this.margeEffacement);
    }

    public ecrireMotsTrouves(listeIndiceMots: IndiceMot[]): void {
        for (const i of listeIndiceMots) {
            if (i.motTrouve.length > 0) {
                this.ecrireMotDansGrille(i.motTrouve, i.sens, i.positionI, i.positionJ, i.couleur);
            }
        }
    }

    public ecrireMotDansGrille(mot: string, sens: number, i: number, j: number, couleur: string): void {
        if (sens === 0) {
            for (let u = 0; u < mot.length; u++) {
                this.ecrireLettreDansCase(mot.charAt(u), i + u, j, couleur);
            }
        } else {
            for (let v = 0; v < mot.length; v++) {
                this.ecrireLettreDansCase(mot.charAt(v), i, j + v, couleur);
            }
        }
    }

    public dessinerRectangleNoir(i: number, j: number) {
        this.ctxCanvas.fillStyle = COULEUR_NOIRE;
        this.ctxCanvas.fillRect(this.largeurCase * i, this.hauteurCase * j, this.largeurCase, this.largeurCase);
    }

    public dessinerCaseNoiresGrilleObtenueServeur(specificationPartie: SpecificationPartie): void {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (specificationPartie.specificationGrilleEnCours.cases.obtenirCase(i, j).obtenirEtat() === 2) {
                    this.dessinerRectangleNoir(j + 1, i + 1);
                }
            }
        }
    }

    public afficherSelecteurMotSurGrille(tailleMot: number, sens: number, i: number,
                                         j: number, couleur: string, ligneDash: boolean = false): void {
        this.ctxCanvas.strokeStyle = couleur;
        this.ctxCanvas.lineWidth = '5';
        this.ctxCanvas.setLineDash([]);
        if (ligneDash) {
            this.ctxCanvas.setLineDash([20, 20]);
        }
        this.ctxCanvas.beginPath();
        if (sens === 0) {
            this.ctxCanvas.rect(this.largeurCase * i, this.hauteurCase * j, this.largeurCase * tailleMot, this.hauteurCase);
            this.ctxCanvas.stroke();
        } else {
            this.ctxCanvas.rect(this.largeurCase * i, this.hauteurCase * j, this.largeurCase, this.hauteurCase * tailleMot);
            this.ctxCanvas.stroke();
        }
    }
}
