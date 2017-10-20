import { FabriqueDeGrille } from './FabriqueDeGrille';
import { MotComplet } from './MotComplet';
import { Case, EtatCase } from '../../commun/Case';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { grandeurMotMinimum } from './GenerateurDeGrilleService';
import { Cases } from '../../commun/Cases';
import { Niveau } from '../../commun/Niveau';
import { Position } from '../../commun/Position';
import { MotsComplet } from './MotsComplet';

export const DIMENSION_LIGNE_COLONNE = 10;
export const contientDejaLeMot = 'Deja le mot';

export enum EtatGrille {
    vide,
    encours,
    complet
}

export class Grille {
    public mots: MotComplet[] = new Array();
    public motsComplet: MotsComplet = new MotsComplet();
    public emplacementMots: EmplacementMot[] = new Array();

    public cases: Cases = new Cases();

    private etat: EtatGrille;
    private niveau: Niveau;

    private nombreMotsSurLigne: number[] = new Array(DIMENSION_LIGNE_COLONNE);
    private nombreMotsSurColonne: number[] = new Array(DIMENSION_LIGNE_COLONNE);

    public constructor(niveau: Niveau, etatCaseInitial: EtatCase = EtatCase.noir) {
        this.niveau = niveau;

        // Instancie la grille vide sans espace noir.
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            this.nombreMotsSurLigne[i] = 0;

            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                const caseBlanche = new Case(i, j, etatCaseInitial);
                this.nombreMotsSurColonne[j] = 0;
                this.cases.ajouterCase(caseBlanche, i, j);
            }
        }
    }

    public obtenirManipulateurCases(): Cases {
        return this.cases;
    }

    public obtenirManipulateurCasesSansLettres(): Cases {

        const stringigfyGrille = JSON.stringify(this);
        const grilleCopier: Grille = FabriqueDeGrille.creerInstanceAvecJSON(stringigfyGrille);

        for (const ligneCourante of grilleCopier.cases.obtenirCases()) {
            for (const caseCourante of ligneCourante) {
                if (caseCourante.obtenirLettre() !== '') {
                    caseCourante.remplirCase('');
                }
            }
        }

        return grilleCopier.cases;
    }

    public obtenirNiveau(): Niveau {
        return this.niveau;
    }

    public estComplete(): boolean {
        for (let i = 0; i < 10; i++) {
            if (((this.obtenirNombreMotsSurLigne(i) !== 1) && (this.obtenirNombreMotsSurLigne(i) !== 2))
                || ((this.obtenirNombreMotsSurColonne(i) !== 1) && (this.obtenirNombreMotsSurColonne(i) !== 2))) {
                return false;
            }
        }
        this.etat = EtatGrille.complet;
        return true;
    }

    public validerMot(): boolean {
        return true;
    }

    public obtenirCases(): Case[][] {
        return this.cases.obtenirCases();
    }

    public obtenirCase(numeroLigne: number, numeroColonne: number): Case {
        if (numeroLigne < 0 || numeroColonne < 0 || numeroLigne >= DIMENSION_LIGNE_COLONNE || numeroColonne >= DIMENSION_LIGNE_COLONNE) {
            return null;
        }

        return this.cases.obtenirCase(numeroLigne, numeroColonne);
    }

    public obtenirMot(): MotComplet[] {
        return this.mots;
    }
    public obtenirMotParticulier(i: number) {
        return this.mots[i];
    }


    public changerEtatCase(etatCase: EtatCase, numeroLigne: number, numeroColonne: number): void {

        this.cases.changerEtatCase(etatCase, numeroLigne, numeroColonne);

    }

    public genererEmplacementsMot() {
        this.genererEmplacementsMotLigne();
        this.genererEmplacementsMotColonne();
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

    private genererEmplacementsMotLigne(): void {
        let caseCourante: Case;
        let caseDebut: Case;
        let caseFin: Case;
        let casesEmplacementMot: Case[] = new Array();
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                caseCourante = this.cases.obtenirCase(i, j).copieCase();


                if ((caseCourante.obtenirEtat() === EtatCase.vide) && caseDebut === undefined) {
                    caseDebut = caseCourante.copieCase();
                }

                if (caseDebut !== undefined) {
                    casesEmplacementMot.push(caseCourante);
                }

                if (((j + 1 < DIMENSION_LIGNE_COLONNE) && (this.cases.obtenirCase(i, j + 1).obtenirEtat() !== EtatCase.vide)) ||
                    (j + 1 === DIMENSION_LIGNE_COLONNE)) {
                    caseFin = caseCourante.copieCase();

                    if (casesEmplacementMot.length >= grandeurMotMinimum) {
                        this.emplacementMots.push(new EmplacementMot(caseDebut, caseFin));
                    }
                    caseFin = undefined;
                    caseDebut = undefined;
                    casesEmplacementMot = new Array();
                    j++;
                }

            }
        }
    }

    private genererEmplacementsMotColonne(): void {
        let caseCourante: Case;
        let caseDebut: Case;
        let caseFin: Case;
        let casesEmplacementMot: Case[] = new Array();
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                caseCourante = this.cases.obtenirCase(j, i);

                if ((caseCourante.obtenirEtat() === EtatCase.vide) && caseDebut === undefined) {
                    caseDebut = caseCourante;
                    casesEmplacementMot.push(caseDebut);
                } else if (caseDebut !== undefined) {
                    casesEmplacementMot.push(caseCourante);
                }

                if ((j + 1 < DIMENSION_LIGNE_COLONNE) && (this.cases.obtenirCase(j + 1, i).obtenirEtat() !== EtatCase.vide) ||
                    (j + 1 === DIMENSION_LIGNE_COLONNE)) {
                    caseFin = caseCourante;

                    if (casesEmplacementMot.length >= grandeurMotMinimum) {
                        this.emplacementMots.push(new EmplacementMot(caseDebut, caseFin));
                    }
                    caseFin = undefined;
                    caseDebut = undefined;
                    casesEmplacementMot = new Array();
                    j++;
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
            // Cas du mot à l'horizontal.

            for (const caseCourante of this.cases.obtenirLigneCases(numeroLigneDepart)) {
                if (this.dansLaLimiteDuMot(caseCourante.obtenirNumeroColonne(),
                    numeroColonneDepart, numeroColonneFin) && mot.estUneLettreValide(positionDansLeMot)) {
                    caseCourante.remplirCase(mot.obtenirLettreSimplifie(positionDansLeMot));
                    positionDansLeMot++;
                }
            }

            this.nombreMotsSurLigne[numeroLigneDepart]++;

        } else if (numeroColonneDepart === numeroColonneFin) {
            // Cas du mot à la vertical.

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
                caseCourante = this.obtenirCase(i, j);
                caseCourante.remettrePointsContraintesAZero();
                this.calculerPointsContraintesDeLaCase(caseCourante,
                    caseCourante.obtenirNumeroLigne(), caseCourante.obtenirNumeroColonne());
            }
        }
    }

    private calculerPointsContraintesDeLaCase(caseCourante: Case, numeroLigneCourant: number, numeroColonneCourant: number): Case {
        // Cas une case en bas contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(numeroLigneCourant + 1, numeroColonneCourant))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Colonne);
        }

        // Cas une case à droite contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(numeroLigneCourant, numeroColonneCourant + 1))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Ligne);
        }

        // Cas une case en haut contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(numeroLigneCourant - 1, numeroColonneCourant))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Colonne);
        }

        // Cas une case à gauche contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(numeroLigneCourant, numeroColonneCourant - 1))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Ligne);
        }

        return caseCourante;
    }

    private peutAccueillirLettre(caseAVerifier: Case): boolean {
        if (caseAVerifier !== null) {
            if (caseAVerifier.etat === EtatCase.vide) {
                return true;
            }
        }

        return false;
    }


    private obtenirLaPositionDeLaPremiereLettreLimiteDuMot(grandeurMot: number): number {
        return DIMENSION_LIGNE_COLONNE - grandeurMot + 1;
    }

    public trouverMeilleurPositionIndexDebut(grandeurMot: number, positionCourante: number, position: Position): number {
        let meilleurPositionIndexDebut = 0;
        let meilleurPointage = 0;

        let pointageCourant: number;
        let positionCaseIndexDebut: number;
        let positionIndexCaseCourante: number;

        let caseCourante: Case;

        for (let i = 0; i < this.obtenirLaPositionDeLaPremiereLettreLimiteDuMot(grandeurMot); i++) {
            pointageCourant = 0;
            positionCaseIndexDebut = i;

            for (let j = 0; j < grandeurMot; j++) {
                positionIndexCaseCourante = i + j;
                caseCourante = this.obtenirCaseSelonPosition(position, positionCourante, positionIndexCaseCourante);

                pointageCourant += caseCourante.obtenirPointsDeContraintes();
            }

            if (i === 0 || meilleurPointage > pointageCourant) {
                meilleurPositionIndexDebut = positionCaseIndexDebut;
                meilleurPointage = pointageCourant;
            }
        }

        return meilleurPositionIndexDebut;
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
