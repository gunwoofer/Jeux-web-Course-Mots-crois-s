import { FabriqueDeGrille } from './FabriqueDeGrille';
import { MotComplet } from './MotComplet';
import { Case, EtatCase } from '../../commun/Case';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { grandeurMotMinimum } from './GrilleConstants';
import { Cases } from '../../commun/Cases';
import { Niveau } from '../../commun/Niveau';
import { Position } from '../../commun/Position';
import { MotsComplet } from './MotsComplet';
import { EtatGrille } from './EtatGrille';

export const DIMENSION_LIGNE_COLONNE = 10;

export class Grille {
    public mots: MotComplet[] = new Array();
    public motsComplet: MotsComplet = new MotsComplet();
    public emplacementMots: EmplacementMot[] = new Array();
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

    public estEgale(emplacement1: EmplacementMot, emplacement2: EmplacementMot): boolean {
        const casesEmplacementMot1: Case[] = this.obtenirCasesSelonCaseDebut(emplacement1.obtenirCaseDebut(),
            emplacement1.obtenirPosition(), emplacement1.obtenirGrandeur());
        const casesEmplacementMot2: Case[] = this.obtenirCasesSelonCaseDebut(emplacement1.obtenirCaseDebut(),
            emplacement1.obtenirPosition(), emplacement1.obtenirGrandeur());
        if (emplacement1.obtenirGrandeur() !== emplacement2.obtenirGrandeur()) {
            return false;
        }
        for (let i = 0; i < emplacement2.obtenirGrandeur(); i++) {
            if ((casesEmplacementMot2[i].obtenirNumeroLigne() !== casesEmplacementMot1[i].obtenirNumeroLigne())
                || (casesEmplacementMot2[i].obtenirNumeroColonne() !== casesEmplacementMot1[i].obtenirNumeroColonne())) {
                return false;
            }
        }
        return true;
    }

    public genererEmplacementsMot() {
        this.genererEmplacementsSelonPosition(Position.Ligne);
        this.genererEmplacementsSelonPosition(Position.Colonne);
    }

    private genererEmplacementsSelonPosition(position: Position): void {
        let caseCourante: Case;
        let caseDebut: Case;
        let longueurMot = 0;
        let etatDeLaCaseProchaine: EtatCase;

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {

                caseCourante = (position === Position.Ligne) ? this.cases.obtenirCase(i, j).copieCase() : 
                                                                this.cases.obtenirCase(j, i).copieCase();
                if ((caseCourante.obtenirEtat() === EtatCase.vide) && caseDebut === undefined) {
                    caseDebut = caseCourante.copieCase();
                }

                if (j + 1 < DIMENSION_LIGNE_COLONNE) {
                    etatDeLaCaseProchaine = (position === Position.Ligne) ? this.cases.obtenirCase(i, j + 1).obtenirEtat() :
                                                                            this.cases.obtenirCase(j + 1, i).obtenirEtat();
                }

                longueurMot++;

                if ((etatDeLaCaseProchaine !== EtatCase.vide) || (j + 1 === DIMENSION_LIGNE_COLONNE)) {

                    if (longueurMot >= grandeurMotMinimum) {
                        this.emplacementMots.push(new EmplacementMot(caseDebut, caseCourante.copieCase()));
                    }

                    // Comme la prochaine case ne peut accueillir une lettre,
                    // on doit remettre les variables à leurs valeurs initales.
                    caseDebut = undefined;
                    longueurMot = 0;
                }
            }
        }
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

    public ajouterMot(mot: MotComplet, numeroLigneDepart: number,
        numeroColonneDepart: number, numeroLigneFin: number, numeroColonneFin: number): void {

        this.mots.push(mot);
        this.motsComplet.ajouterMot(mot);
        let positionDansLeMot = 0;

        if (numeroLigneDepart === numeroLigneFin) {
            for (const caseCourante of this.cases.obtenirLigneCases(numeroLigneDepart)) {
                if (this.dansLaLimiteDuMot(caseCourante.obtenirNumeroColonne(),
                    numeroColonneDepart, numeroColonneFin) && mot.estUneLettreValide(positionDansLeMot)) {
                    caseCourante.remplirCase(mot.obtenirLettreSimplifie(positionDansLeMot));
                    positionDansLeMot++;
                }
            }

            this.nombreMotsSurLigne[numeroLigneDepart]++;
        } else if (numeroColonneDepart === numeroColonneFin) {
            let lettreSimplifie: string;
            for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
                if (this.dansLaLimiteDuMot(i, numeroLigneDepart, numeroLigneFin) && mot.estUneLettreValide(positionDansLeMot)) {
                    lettreSimplifie = mot.obtenirLettreSimplifie(positionDansLeMot);
                    this.cases.remplirCase(lettreSimplifie, i, numeroColonneDepart);
                    positionDansLeMot++;
                }
            }

            this.nombreMotsSurColonne[numeroColonneDepart]++;
        }
    }

    public obtenirCaseSelonPosition(position: Position, indexFixe: number, index: number): Case {
        return this.cases.obtenirCaseSelonPosition(position, indexFixe, index);
    }

    public obtenirNombreMotsSurLigne(ligne: number): number {

        if (ligne >= DIMENSION_LIGNE_COLONNE) {
            return -1;
        }
        return this.nombreMotsSurLigne[ligne];
    }

    public obtenirNombreMotsSurColonne(ligne: number): number {

        if (ligne >= DIMENSION_LIGNE_COLONNE) {
            return -1;
        }
        return this.nombreMotsSurColonne[ligne];
    }

    public obtenirEmplacementsMot(): EmplacementMot[] {
        return this.emplacementMots;
    }

    public modifierEmplacementsMot(emplacementsMot: EmplacementMot[]) {
        this.emplacementMots = emplacementsMot;
    }

    public dansLaLimiteDuMot(caseCourante: number, debutNumeroColonne: number, finNumeroColonne: number): boolean {
        if (caseCourante >= debutNumeroColonne && caseCourante <= finNumeroColonne) {
            return true;
        }
        return false;
    }

    public obtenirLongueurCases(): number {
        return DIMENSION_LIGNE_COLONNE;
    }

    public obtenirHauteurCases(): number {
        let nbrCasesY = 0;
        for (const casesDeLaLigne of this.cases.obtenirCases()) {
            if (nbrCasesY !== 0 && nbrCasesY !== casesDeLaLigne.length) {
                return -1;
            }
            nbrCasesY = casesDeLaLigne.length;
        }
        return nbrCasesY;
    }

    public verifierMot(motAVerifier: string, caseDebut: Case, caseFin: Case): boolean {
        let casesEmplacementMot: Case[] = new Array();
        for (const emplacementMot of this.emplacementMots) {
            casesEmplacementMot = this.cases.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
                emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());
            if (this.estLeBonEmplacementMot(emplacementMot, caseDebut, caseFin) &&
                this.cases.obtenirMotDesCases(casesEmplacementMot) === motAVerifier && !emplacementMot.aEteTrouve()) {
                emplacementMot.estTrouve();
                return true;
            }
        }
        return false;
    }

    public obtenirCasesSelonCaseDebut(caseDebut: Case, direction: Position, grandeur: number): Case[] {
        return this.cases.obtenirCasesSelonCaseDebut(caseDebut, direction, grandeur);
    }

    public obtenirEmplacementMot(caseDebut: Case, caseFin: Case): EmplacementMot {
        for (const emplacementMot of this.emplacementMots) {
            if (this.estLeBonEmplacementMot(emplacementMot, caseDebut, caseFin)) {
                return emplacementMot;
            }
        }
        return undefined;
    }

    public ObtenirEmplacementMotSelonEmplacementMot(emplacementMot: EmplacementMot) {
        for (const emplacement of this.emplacementMots) {
            if (emplacement.estPareilQue(emplacementMot)) {
                return emplacement;
            }
        }
    }

    private estLeBonEmplacementMot(emplacementMot: EmplacementMot, caseDebut: Case, caseFin: Case): boolean {
        if ((emplacementMot.obtenirCaseDebut().obtenirNumeroLigne() === caseDebut.obtenirNumeroLigne())
        && (emplacementMot.obtenirCaseFin().obtenirNumeroLigne() === caseFin.obtenirNumeroLigne())) {
            if ((emplacementMot.obtenirCaseDebut().obtenirNumeroColonne() === caseDebut.obtenirNumeroColonne())
            && (emplacementMot.obtenirCaseFin().obtenirNumeroColonne() === caseFin.obtenirNumeroColonne())) {
                return true;
            }
        }
        return false;
    }

    public calculerPointsContraintes(): void {
        let caseCourante: Case;
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                caseCourante = this.cases.obtenirCase(i, j);
                caseCourante.remettrePointsContraintesAZero();
                this.cases.calculerPointsContraintesDeLaCase(caseCourante,
                    caseCourante.obtenirNumeroLigne(), caseCourante.obtenirNumeroColonne());
            }
        }
    }

    public emplacementsHorizontaux(): EmplacementMot[] {
        const emplacementsHorizontaux: EmplacementMot[] = new Array();
        for (let i = 0; i < this.emplacementMots.length; i++) {
            if (this.emplacementMots[i].estHorizontal()) {
                emplacementsHorizontaux.push(this.emplacementMots[i]);
            }
        }
        return emplacementsHorizontaux;
    }
}
