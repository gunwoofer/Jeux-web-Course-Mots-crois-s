import { MotComplet } from './MotComplet';
import { Case, EtatCase } from './Case';
import { EmplacementMot } from './EmplacementMot';
import { grandeurMotMinimum } from './GenerateurDeGrilleService';


export const DIMENSION_LIGNE_COLONNE = 10;

export enum EtatGrille {
    vide,
    encours,
    complet
}

export enum Niveau {
    facile,
    moyen,
    difficile
}

export enum Position {
    Ligne,
    Colonne
}

export class Grille {
    private mots: MotComplet[] = new Array();
    private emplacementMots: EmplacementMot[] = new Array();

    private cases: Case[][] = new Array(DIMENSION_LIGNE_COLONNE);

    private etat: EtatGrille;
    private niveau: Niveau;

    private nombreMotsSurLigne: number[] = new Array(DIMENSION_LIGNE_COLONNE);
    private nombreMotsSurColonne: number[] = new Array(DIMENSION_LIGNE_COLONNE);

    public constructor(niveau: Niveau, etatCaseInitial: EtatCase = EtatCase.noir) {
        this.niveau = niveau;

        // Instancie la grille vide sans espace noir.
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            this.cases[i] = new Array(DIMENSION_LIGNE_COLONNE);
            this.nombreMotsSurLigne[i] = 0;

            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                const caseBlanche = new Case(i, j, etatCaseInitial);
                this.nombreMotsSurColonne[j] = 0;
                this.cases[i][j] = caseBlanche;
            }
        }
    }

    public copieGrille(): Grille {
        let newGrille: Grille = new Grille(this.niveau);
        newGrille.etat = this.etat;
        newGrille.nombreMotsSurColonne = this.nombreMotsSurColonne;
        newGrille.nombreMotsSurLigne = this.nombreMotsSurLigne;
       
        for(let i = 0; i < this.cases.length; i++) {
            for(let j = 0; j < this.cases[i].length; j++) {
                newGrille.cases[i][j] = this.cases[i][j].copieCase();
            }
        }
        for(let i = 0; i < this.emplacementMots.length; i++) {
            newGrille.emplacementMots[i] = this.emplacementMots[i].copieEmplacement();
        }
        for(let i = 0; i < this.mots.length; i++) {
            newGrille.mots[i] = this.mots[i].copieMot();
        }
        return newGrille
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
        return this.cases;
    }

    public obtenirCase(numeroLigne: number, numeroColonne: number): Case {
        if (numeroLigne < 0 || numeroColonne < 0 || numeroLigne >= DIMENSION_LIGNE_COLONNE || numeroColonne >= DIMENSION_LIGNE_COLONNE) {
            return null;
        }

        return this.cases[numeroLigne][numeroColonne];
    }

    public obtenirCaseSelonPosition(position: Position, indexFixe: number, index: number): Case {
        switch (position) {
            case Position.Ligne:
                return this.cases[indexFixe][index];

            case Position.Colonne:
                return this.cases[index][indexFixe];
        }
    }

    public obtenirMot(): MotComplet[] {
        return this.mots;
    }
    public obtenirMotParticulier(i: number) {
        return this.mots[i];
    }


    public changerEtatCase(etatCase: EtatCase, numeroLigne: number, numeroColonne: number): void {

        this.cases[numeroLigne][numeroColonne].etat = etatCase;

    }

    public genererEmplacementsMot() {
        this.genererEmplacementsMotLigne();
        this.genererEmplacementsMotColonne();
    }

    private genererEmplacementsMotLigne() {
        let caseCourante: Case;
        let caseDebut: Case = undefined;
        let caseFin: Case = undefined;
        let casesEmplacementMot: Case[] = new Array();
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                caseCourante = this.cases[i][j];

                if ((caseCourante.obtenirEtat() === EtatCase.vide) && caseDebut === undefined) {
                    caseDebut = caseCourante;
                }

                if (caseDebut !== undefined) {
                    casesEmplacementMot.push(caseCourante);
                }

                if (((j + 1 < DIMENSION_LIGNE_COLONNE) && (this.cases[i][j + 1].obtenirEtat() !== EtatCase.vide)) ||
                    (j + 1 === DIMENSION_LIGNE_COLONNE)) {
                    caseFin = caseCourante;

                    if(casesEmplacementMot.length >= grandeurMotMinimum) {
                        this.emplacementMots.push(new EmplacementMot(caseDebut, caseFin, casesEmplacementMot));
                    }
                    caseFin = undefined;
                    caseDebut = undefined;
                    casesEmplacementMot = new Array();
                    j++;
                }

            }
        }
    }

    private genererEmplacementsMotColonne() {
        let caseCourante: Case;
        let caseDebut: Case = undefined;
        let caseFin: Case = undefined;
        let casesEmplacementMot: Case[] = new Array();
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                caseCourante = this.cases[j][i];

                if ((caseCourante.obtenirEtat() === EtatCase.vide) && caseDebut === undefined) {
                    caseDebut = caseCourante;
                    casesEmplacementMot.push(caseDebut);
                } else if (caseDebut !== undefined) {
                    casesEmplacementMot.push(caseCourante);
                }

                if ((j + 1 < DIMENSION_LIGNE_COLONNE) && (this.cases[j + 1][i].obtenirEtat() !== EtatCase.vide) ||
                    (j + 1 === DIMENSION_LIGNE_COLONNE)) {
                    caseFin = caseCourante;

                    if(casesEmplacementMot.length >= grandeurMotMinimum) {
                        this.emplacementMots.push(new EmplacementMot(caseDebut, caseFin, casesEmplacementMot));
                    }
                    caseFin = undefined;
                    caseDebut = undefined;
                    casesEmplacementMot = new Array();
                    j++;
                }

            }
        }
    }

    public ajouterMot(mot: MotComplet, numeroLigneDepart: number,
        numeroColonneDepart: number, numeroLigneFin: number, numeroColonneFin: number): void {

        this.mots.push(mot);
        let positionDansLeMot = 0;

        if (numeroLigneDepart === numeroLigneFin) {
            // Cas du mot à l'horizontal.

            for (const caseCourante of this.cases[numeroLigneDepart]) {
                if (this.dansLaLimiteDuMot(caseCourante.obtenirNumeroColonne(),
                    numeroColonneDepart, numeroColonneFin) && mot.estUneLettreValide(positionDansLeMot)) {
                    caseCourante.remplirCase(mot.obtenirLettreSimplifie(positionDansLeMot));
                    positionDansLeMot++;
                }
            }

            this.nombreMotsSurLigne[numeroLigneDepart]++;

        } else if (numeroColonneDepart === numeroColonneFin) {
            // Cas du mot à la vertical.

            for (let i = 0; i < this.cases.length; i++) {
                if (this.dansLaLimiteDuMot(i, numeroLigneDepart, numeroLigneFin) && mot.estUneLettreValide(positionDansLeMot)) {
                    this.cases[i][numeroColonneDepart].remplirCase(mot.obtenirLettreSimplifie(positionDansLeMot));
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

    public obtenirPositionsEmplacementsVides(): EmplacementMot[] {
        return this.emplacementMots;
    }

    public dansLaLimiteDuMot(caseCourante: number, debutNumeroColonne: number, finNumeroColonne: number): boolean {
        if (caseCourante >= debutNumeroColonne && caseCourante <= finNumeroColonne) {
            return true;
        }

        return false;
    }

    public obtenirLongueurCases(): number {
        return this.cases.length;
    }

    public obtenirHauteurCases(): number {
        let nbrCasesY = 0;

        for (const casesDeLaLigne of this.cases) {
            if (nbrCasesY !== 0 && nbrCasesY !== casesDeLaLigne.length) {
                return -1;
            }
            nbrCasesY = casesDeLaLigne.length;
        }

        return nbrCasesY;
    }

    public verifierMot(motAVerifier: string, caseDebut: Case, caseFin: Case): boolean {
        
        for (const emplacementMot of this.emplacementMots) {
            if (this.estLeBonEmplacementMot(emplacementMot, caseDebut, caseFin) && emplacementMot.obtenirMotDesCases() === motAVerifier) {
                emplacementMot.estTrouve();
                return true;
            }
        }

        return false;
    }

    public obtenirEmplacementMot(caseDebut: Case, caseFin: Case): EmplacementMot {
        for (const emplacementMot of this.emplacementMots) {
            if (this.estLeBonEmplacementMot(emplacementMot, caseDebut, caseFin)) {
                return emplacementMot;
            }
        }

        return undefined;
    }

    private estLeBonEmplacementMot(emplacementMot: EmplacementMot, caseDebut: Case, caseFin: Case): boolean{
        return (emplacementMot.obtenirCaseDebut() === caseDebut) && (emplacementMot.obtenirCaseFin() === caseFin);
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
                this.calculerPointsContraintesDeLaCase(caseCourante, caseCourante.obtenirNumeroLigne(), caseCourante.obtenirNumeroColonne());
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
        let emplacementsHorizontaux: EmplacementMot[] = new Array();
        for(let i = 0; i < this.emplacementMots.length; i++) {
            if(this.emplacementMots[i].estHorizontal()) {
                emplacementsHorizontaux.push(this.emplacementMots[i]);
            }
        }
        return emplacementsHorizontaux;
    }

    public emplacementsVerticaux(): EmplacementMot[] {
        let emplacementsVerticaux: EmplacementMot[] = new Array();
        for(let i = 0; i < this.emplacementMots.length; i++) {
            if(this.emplacementMots[i].estVertical()) {
                emplacementsVerticaux.push(this.emplacementMots[i]);
            }
        }
        return emplacementsVerticaux;
    }

    public genererEmplacementsAlterne(): EmplacementMot[] {
        let tableauEmplacementsHorizontaux: EmplacementMot[] = this.emplacementsHorizontaux();
        let tableauEmplacementsVerticaux : EmplacementMot[] = this.emplacementsVerticaux();
        let newEmplacements: EmplacementMot[] = new Array();
        let j: number = 0;
        let max: number = 0;
        let min: number = 0;

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
}
