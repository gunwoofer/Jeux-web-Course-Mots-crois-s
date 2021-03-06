import { RequisPourMotAVerifier } from '../../commun/requis/requisPourMotAVerifier';
import { FabriqueDeGrille } from './fabriqueDeGrille';
import { MotComplet } from './motComplet';
import { Case, EtatCase } from '../../commun/case';
import { EmplacementMot } from '../../commun/emplacementMot';
import { Cases } from '../../commun/cases';
import { Niveau } from '../../commun/niveau';
import { Position } from '../../commun/position';
import { MotsComplet } from './motsComplet';
import { EmplacementsMots } from '../../commun/emplacementsMots';

export const DIMENSION_LIGNE_COLONNE = 10;

export class Grille {
    public mots: MotComplet[] = new Array();
    public motsComplet: MotsComplet = new MotsComplet();
    public emplacementMots: EmplacementMot[] = new Array();
    public emplacementsMots: EmplacementsMots = new EmplacementsMots();
    public cases: Cases = new Cases();
    public niveau: Niveau;
    private nombreMotsSurLigne: number[] = new Array(DIMENSION_LIGNE_COLONNE);
    private nombreMotsSurColonne: number[] = new Array(DIMENSION_LIGNE_COLONNE);

    public constructor(niveau: Niveau, etatCaseInitial: EtatCase = EtatCase.noir) {
        this.niveau = niveau;

        this.viderGrille(etatCaseInitial);
    }

    private viderGrille(etatCaseInitial: EtatCase): void {
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            this.nombreMotsSurLigne[i] = 0;

            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                const caseNoir = new Case(i, j, etatCaseInitial);
                this.nombreMotsSurColonne[j] = 0;
                this.cases.ajouterCase(caseNoir, i, j);
            }
        }
    }

    public obtenirManipulateurCasesSansLettres(): Cases {
        const stringigfyGrille = JSON.stringify(this);
        const grilleCopier: Grille = FabriqueDeGrille.creerInstanceAvecJSON(stringigfyGrille);

        grilleCopier.cases.viderCases();

        return grilleCopier.cases;
    }

    public genererEmplacementsMot() {
        this.emplacementsMots.genererEmplacementsSelonPosition(this.cases, Position.Ligne);
        this.emplacementsMots.genererEmplacementsSelonPosition(this.cases, Position.Colonne);
    }

    public ajouterMotEmplacement(mot: MotComplet, emplacement: EmplacementMot): void {
        this.mots.push(mot);
        this.motsComplet.ajouterMot(mot);
        let positionDansLeMot = 0;
        const numeroLigneDepart: number = emplacement.obtenirCaseDebut().obtenirNumeroLigne();
        const numeroLigneFin: number = emplacement.obtenirCaseFin().obtenirNumeroLigne();
        const numeroColonneDepart: number = emplacement.obtenirCaseDebut().obtenirNumeroColonne();
        const numeroColonneFin: number = emplacement.obtenirCaseFin().obtenirNumeroColonne();
        const casesEmplacementMot: Case[] = this.obtenirCasesSelonCaseDebut(emplacement.obtenirCaseDebut(),
                                                                            emplacement.obtenirPosition(), emplacement.obtenirGrandeur());

        for (const caseCourante of casesEmplacementMot) {
            const ligne: number = caseCourante.obtenirNumeroLigne();
            const colonne: number = caseCourante.obtenirNumeroColonne();
            const lettreSimplifie: string = mot.obtenirLettreSimplifie(positionDansLeMot);

            this.cases.remplirCase(lettreSimplifie, ligne, colonne);
            positionDansLeMot++;
        }
        if (numeroLigneDepart === numeroLigneFin) {
            this.nombreMotsSurLigne[numeroLigneDepart]++;
        } else if (numeroColonneDepart === numeroColonneFin) {
            this.nombreMotsSurColonne[numeroColonneDepart]++;
        }
    }

    public obtenirNombreMotsSurLigne(ligne: number): number {
        return this.nombreMotsSurLigne[ligne];
    }

    public obtenirNombreMotsSurColonne(ligne: number): number {
        return this.nombreMotsSurColonne[ligne];
    }

    public obtenirEmplacementsMot(): EmplacementMot[] {
        return this.emplacementsMots.emplacementMots;
    }

    public modifierEmplacementsMot(emplacementsMot: EmplacementMot[]) {
        this.emplacementMots = emplacementsMot;
        this.emplacementsMots.emplacementMots = emplacementsMot;
    }

    public obtenirCasesSelonCaseDebut(caseDebut: Case, direction: Position, grandeur: number): Case[] {
        return this.cases.obtenirCasesSelonCaseDebut(caseDebut, direction, grandeur);
    }

    public verifierMot(requisPourMotAVerifier: RequisPourMotAVerifier): boolean {
        return this.emplacementsMots.verifierMot(this.cases, requisPourMotAVerifier);
    }
}
