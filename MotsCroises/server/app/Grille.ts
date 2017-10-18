import { Indice } from './Indice';
import { MotComplet } from './MotComplet';
import { Case, EtatCase } from '../../commun/Case';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { grandeurMotMinimum } from './GenerateurDeGrilleService';
import { Cases } from '../../commun/Cases';
import { Niveau } from '../../commun/Niveau';
import { Position } from '../../commun/Position';


export const DIMENSION_LIGNE_COLONNE = 10;
export const contientDejaLeMot = 'Deja le mot';

export enum EtatGrille {
    vide,
    encours,
    complet
}

export class Grille {
    private mots: MotComplet[] = new Array();
    public emplacementMots: EmplacementMot[] = new Array();

    private cases: Cases = new Cases();

    private etat: EtatGrille;
    private niveau: Niveau;

    private nombreMotsSurLigne: number[] = new Array(DIMENSION_LIGNE_COLONNE);
    private nombreMotsSurColonne: number[] = new Array(DIMENSION_LIGNE_COLONNE);


    public static creerInstanceAvecJSON(jsonGrille: string): Grille {
        const jsonEnGrille = (JSON.parse(jsonGrille) as Grille);

        const vraieGrille: Grille = new Grille(Niveau.facile);

        Object.assign(vraieGrille, jsonEnGrille);

        const vraiEmplacementsMot: EmplacementMot[] = this.creerInstanceAvecJSONEmplacementMots(jsonEnGrille);
        const vraiCases: Cases = this.creerInstanceAvecJSONCases(jsonEnGrille);
        const vraiMotsComplet: MotComplet[] = this.creerInstanceAvecJSONMotComplet(jsonEnGrille);

        vraieGrille.cases = vraiCases;
        vraieGrille.modifierEmplacementsMot(vraiEmplacementsMot);
        vraieGrille.mots = vraiMotsComplet;


        return vraieGrille;
    }


    private static creerInstanceAvecJSONMotComplet(jsonEnGrille: Grille): MotComplet[] {
        const vraiMotsComplet: MotComplet[] = new Array();
        let vraiMotComplet: MotComplet;

        for (const motCompletCourant of jsonEnGrille.mots) {
            // Permet de surpasser l'encapsulation de l'objet (incomplet) MotComplet.
            const motCompletIncomplet: any = motCompletCourant;

            vraiMotComplet = new MotComplet(motCompletCourant.lettres, motCompletIncomplet.indice);
            Object.assign(vraiMotComplet, motCompletCourant);
            vraiMotsComplet.push(vraiMotComplet);
        }

        return vraiMotsComplet;
    }

    private static creerInstanceAvecJSONEmplacementMots(jsonEnGrille: Grille): EmplacementMot[] {
        const vraiEmplacementsMot: EmplacementMot[] = new Array();
        let vraieEmplacementMot: EmplacementMot;
        let vraieCaseDebut: Case;
        let vraieCaseFin: Case;
        let emplacementMotCourant: any;
        for (let i = 0; i < jsonEnGrille.emplacementMots.length; i++) {
            emplacementMotCourant = jsonEnGrille.emplacementMots[i];
            vraieCaseDebut = new Case(emplacementMotCourant.caseDebut.numeroLigne,
                emplacementMotCourant.caseDebut.numeroColonne, emplacementMotCourant.caseDebut.etat);
            vraieCaseFin = new Case(emplacementMotCourant.caseFin.numeroLigne,
                emplacementMotCourant.caseFin.numeroColonne, emplacementMotCourant.caseFin.etat);

            // Permet de surpasser l'encapsulation de l'objet (incomplet) EmplacementMot.
            const emplacementMotIncomplet: any = jsonEnGrille.emplacementMots[i];

            Object.assign(vraieCaseDebut, emplacementMotIncomplet.caseDebut as Case);
            Object.assign(vraieCaseFin, emplacementMotIncomplet.caseFin as Case);

            vraieEmplacementMot = new EmplacementMot(vraieCaseDebut, vraieCaseFin);

            Object.assign(vraieEmplacementMot, emplacementMotCourant as EmplacementMot);

            vraieEmplacementMot.modifierCaseDebutFin(vraieCaseDebut, vraieCaseFin);


            vraiEmplacementsMot.push(vraieEmplacementMot);
        }

        return vraiEmplacementsMot;
    }

    private static creerInstanceAvecJSONCases(jsonEnGrille: any): Cases {
        const cases: Cases = new Cases();
        let vraieCase: Case;

        for (let i = 0; i < jsonEnGrille.cases.cases.length; i++) {
            for (let j = 0; j < jsonEnGrille.cases.cases[i].length; j++) {
                vraieCase = new Case(jsonEnGrille.cases.cases[i][j].numeroLigne,
                    jsonEnGrille.cases.cases[i][j].numeroColonne, jsonEnGrille.cases.cases[i][j].etat);
                Object.assign(vraieCase, jsonEnGrille.cases.cases[i][j] as Case);

                cases.ajouterCase(vraieCase, vraieCase.obtenirNumeroLigne(), vraieCase.obtenirNumeroColonne());

            }
        }

        return cases;
    }

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
        const grilleCopier: Grille = Grille.creerInstanceAvecJSON(stringigfyGrille);

        for (const ligneCourante of grilleCopier.cases.obtenirCases()) {
            for (const caseCourante of ligneCourante) {
                if (caseCourante.obtenirLettre() !== '') {
                    caseCourante.remplirCase('');
                }
            }
        }

        return grilleCopier.cases;
    }

    public copieGrille(): Grille {
        const newGrille: Grille = new Grille(this.niveau);
        newGrille.etat = this.etat;
        newGrille.nombreMotsSurColonne = this.nombreMotsSurColonne;
        newGrille.nombreMotsSurLigne = this.nombreMotsSurLigne;

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                newGrille.cases.ajouterCase(this.cases.obtenirCase(i, j).copieCase(), i, j);
            }
        }
        for (let i = 0; i < this.emplacementMots.length; i++) {
            newGrille.emplacementMots[i] = this.emplacementMots[i].copieEmplacement();
        }
        for (let i = 0; i < this.mots.length; i++) {
            newGrille.mots[i] = this.mots[i].copieMot();
        }
        return newGrille;
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

    public obtenirCaseSelonPosition(position: Position, indexFixe: number, index: number): Case {
        switch (position) {
            case Position.Ligne:
                return this.cases.obtenirCase(indexFixe, index);

            case Position.Colonne:
                return this.cases.obtenirCase(index, indexFixe);
        }
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
            casesEmplacementMot = this.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
                emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());
            if (this.estLeBonEmplacementMot(emplacementMot, caseDebut, caseFin) &&
                this.obtenirMotDesCases(casesEmplacementMot) === motAVerifier && !emplacementMot.aEteTrouve()) {
                emplacementMot.estTrouve();
                return true;
            }
        }

        return false;
    }


    public obtenirMotDesCases(cases: Case[]): string {
        let motDansLesCases = '';

        for (const caseCourante of cases) {
            motDansLesCases += caseCourante.obtenirLettre();
        }

        return motDansLesCases;
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

    public contientDejaLeMot(mot: MotComplet): boolean {
        for (const motCourant of this.mots) {
            if (motCourant.obtenirLettres() === mot.obtenirLettres()) {
                return true;
            }
        }
        return false;


    }

    public contientMotDuplique(): boolean {
        for (const motAChercher of this.mots) {
            let compteur = 0;
            const lettresAChercher: string = motAChercher.obtenirLettres();
            for (const motCourant of this.mots) {
                if (lettresAChercher === motCourant.obtenirLettres()) {
                    compteur++;
                }
                if (compteur > 1) {
                    return true;
                }
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

    public emplacementsVerticaux(): EmplacementMot[] {
        const emplacementsVerticaux: EmplacementMot[] = new Array();
        for (let i = 0; i < this.emplacementMots.length; i++) {
            if (this.emplacementMots[i].estVertical()) {
                emplacementsVerticaux.push(this.emplacementMots[i]);
            }
        }
        return emplacementsVerticaux;
    }

    public genererEmplacementsAlterne(): EmplacementMot[] {
        const tableauEmplacementsHorizontaux: EmplacementMot[] = this.emplacementsHorizontaux();
        const tableauEmplacementsVerticaux: EmplacementMot[] = this.emplacementsVerticaux();
        const newEmplacements: EmplacementMot[] = new Array();
        let j = 0;
        let max = 0;
        let min = 0;

        max = Math.max(tableauEmplacementsVerticaux.length, tableauEmplacementsHorizontaux.length);
        min = Math.min(tableauEmplacementsVerticaux.length, tableauEmplacementsHorizontaux.length);

        for (let i = 0; i < this.emplacementMots.length; i++) {
            if (j < min) {
                newEmplacements[i] = tableauEmplacementsHorizontaux[j];
                i++;
                newEmplacements[i] = tableauEmplacementsVerticaux[j];
                j++;
            }
            if (tableauEmplacementsHorizontaux.length === max && j >= min) {
                newEmplacements[i] = tableauEmplacementsHorizontaux[j];
                j++;
            }
            if (tableauEmplacementsVerticaux.length === max && j >= min) {
                newEmplacements[i] = tableauEmplacementsVerticaux[j];
                j++;
            }
        }

        return newEmplacements;
    }



    public genererEmplacementsNonComplet(): EmplacementMot[] {
        const emplacementsNonComplets: EmplacementMot[] = new Array();
        let casesEmplacementMot: Case[] = new Array();
        for (const emplacementCourant of this.emplacementMots) {
            let estComplet = true;
            casesEmplacementMot = this.obtenirCasesSelonCaseDebut(emplacementCourant.obtenirCaseDebut(),
                emplacementCourant.obtenirPosition(), emplacementCourant.obtenirGrandeur());

            for (let i = 0; i < casesEmplacementMot.length; i++) {
                // On perd la liaison entre l emplacement et la case alors on utilise les coord de l emplacement et on se refere a la grille
                const ligne = casesEmplacementMot[i].obtenirNumeroLigne();
                const colonne = casesEmplacementMot[i].obtenirNumeroColonne();
                if (this.obtenirCase(ligne, colonne).etat === EtatCase.vide) {
                    estComplet = false;
                }
            }
            if (!estComplet) {
                emplacementsNonComplets.push(emplacementCourant);
            }
        }
        return emplacementsNonComplets;
    }

    public obtenirCasesSelonCaseDebut(caseDebut: Case, direction: Position, grandeur: number): Case[] {
        const cases: Case[] = new Array();
        let positionLigne: number;
        let positionColonne: number;

        for (let i = 0; i < grandeur; i++) {
            switch (direction) {
                case Position.Ligne:
                    positionLigne = caseDebut.obtenirNumeroLigne();
                    positionColonne = caseDebut.obtenirNumeroColonne() + i;
                    break;

                case Position.Colonne:
                    positionLigne = caseDebut.obtenirNumeroLigne() + i;
                    positionColonne = caseDebut.obtenirNumeroColonne();
                    break;
            }

            cases.push(this.cases.obtenirCase(positionLigne, positionColonne));
        }

        return cases;
    }

    public genererEmplacementPlusDeContraintes(): EmplacementMot {
        const emplacementsNonComplet = this.genererEmplacementsNonComplet();
        let emplacementsPlusDeContrainte: EmplacementMot;
        let maxPointsContrainte: number = -1;
        let casesEmplacementMot: Case[];
        for (const emplacementCourant of emplacementsNonComplet) {
            let pointsContrainte = 0;
            casesEmplacementMot = this.obtenirCasesSelonCaseDebut(emplacementCourant.obtenirCaseDebut(),
                emplacementCourant.obtenirPosition(), emplacementCourant.obtenirGrandeur());
            for (let j = 0; j < emplacementCourant.obtenirGrandeur(); j++) {
                // On perd la liaison entre l emplacement et la case alors on utilise les coord de l emplacement et on se refere a la grille
                const ligne = casesEmplacementMot[j].obtenirNumeroLigne();
                const colonne = casesEmplacementMot[j].obtenirNumeroColonne();
                if (this.obtenirCase(ligne, colonne).etat === EtatCase.pleine) {
                    pointsContrainte += 1;
                }
            }
            if (pointsContrainte > maxPointsContrainte) {
                emplacementsPlusDeContrainte = emplacementCourant.copieEmplacement();
                maxPointsContrainte = pointsContrainte;
            }
        }
        return emplacementsPlusDeContrainte;
    }

    public genererEmplacementsNonCompletIndice(): number[] {
        const indiceEmplacementsNonComplets: number[] = new Array();
        let casesEmplacementMot: Case[];
        for (let indice = 0; indice < this.emplacementMots.length; indice++) {
            let estComplet = true;
            casesEmplacementMot = this.obtenirCasesSelonCaseDebut(this.emplacementMots[indice].obtenirCaseDebut(),
                this.emplacementMots[indice].obtenirPosition(), this.emplacementMots[indice].obtenirGrandeur());
            for (let i = 0; i < this.emplacementMots[indice].obtenirGrandeur(); i++) {
                // On perd la liaison entre l emplacement et la case alors on utilise les coord de l emplacement et on se refere a la grille
                const ligne = casesEmplacementMot[i].obtenirNumeroLigne();
                const colonne = casesEmplacementMot[i].obtenirNumeroColonne();
                if (this.obtenirCase(ligne, colonne).etat === EtatCase.vide) {
                    estComplet = false;
                }
            }
            if (!estComplet) {
                indiceEmplacementsNonComplets.push(indice);
            }
        }
        return indiceEmplacementsNonComplets;
    }

    public genererEmplacementPlusDeContraintesIndice(): number {
        const indiceEmplacementsNonComplet = this.genererEmplacementsNonCompletIndice();
        let indiceEmplacementPlusDeContrainte: number;
        let maxPointsContrainte = -1;
        let casesEmplacementMot: Case[];
        for (const indice of indiceEmplacementsNonComplet) {
            let pointsContrainte = 0;
            casesEmplacementMot = this.obtenirCasesSelonCaseDebut(this.emplacementMots[indice].obtenirCaseDebut(),
                this.emplacementMots[indice].obtenirPosition(), this.emplacementMots[indice].obtenirGrandeur());
            for (let j = 0; j < this.emplacementMots[indice].obtenirGrandeur(); j++) {
                // On perd la liaison entre l emplacement et la case alors on utilise les coord de l emplacement et on se refere a la grille
                const ligne = casesEmplacementMot[j].obtenirNumeroLigne();
                const colonne = casesEmplacementMot[j].obtenirNumeroColonne();
                if (this.obtenirCase(ligne, colonne).etat === EtatCase.pleine) {
                    pointsContrainte += 1;
                }
            }
            if (pointsContrainte > maxPointsContrainte) {
                indiceEmplacementPlusDeContrainte = indice;
                maxPointsContrainte = pointsContrainte;
            }
        }
        return indiceEmplacementPlusDeContrainte;
    }

    public trouverMotEmplacement(emplacement: EmplacementMot): MotComplet {
        let chaine = '';
        const casesEmplacementMot: Case[] = this.obtenirCasesSelonCaseDebut(emplacement.obtenirCaseDebut(),
            emplacement.obtenirPosition(), emplacement.obtenirGrandeur());
        for (let i = 0; i < emplacement.obtenirGrandeur(); i++) {
            const ligne = casesEmplacementMot[i].obtenirNumeroLigne();
            const colonne = casesEmplacementMot[i].obtenirNumeroColonne();
            chaine += this.obtenirCase(ligne, colonne).obtenirLettre();
        }
        const mot = this.trouverMotAPartirString(chaine);
        return mot;

    }

    public trouverMotAPartirString(lettres: string): MotComplet {
        for (let i = 0; i < this.mots.length; i++) {
            if (lettres === this.mots[i].lettres) {
                return this.mots[i];
            }
        }
        throw new Error('Le mot de cet emplacement est erroné');
    }

    public trouverIndiceEmplacement(emplacement: EmplacementMot): number {
        for (let indice = 0; indice < this.emplacementMots.length; indice++) {
            if (this.estEgale(this.emplacementMots[indice], emplacement)) {
                return indice;
            }
        }
        return -1;
    }

    public affichageConsole(): void {
        console.log('-----------------------');
        let ligne: string[] = new Array();
        let buffer = '';
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {

                ligne.push(this.cases.obtenirCase(i, j).obtenirLettre());
            }
            for (let k = 0; k < ligne.length; k++) {
                if (ligne[k] !== undefined) {
                    buffer += ' ' + ligne[k] + ' ';
                } else {
                    buffer += ' * ';
                }
            }

            console.log(buffer);
            buffer = '';
            ligne = new Array();
        }
        console.log('-----------------------');
    }

    public recupererIndices(): Indice[] {
        const tableauIndices: Indice[] = new Array();
        for (const mot of this.mots) {
            tableauIndices.push(mot.obtenirIndice());
        }
        return tableauIndices;
    }
}
