import { MotComplet } from './MotComplet';
import { Case, EtatCase } from './Case';
import { EmplacementMot } from './EmplacementMot';
import { grandeurMotMinimum } from './GenerateurDeGrilleService';
import { Cases } from './Cases';


export const DIMENSION_LIGNE_COLONNE = 10;
export const contientDejaLeMot = 'Deja le mot';

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

    private casesExterne: Cases = new Cases();

    private etat: EtatGrille;
    private niveau: Niveau;

    private nombreMotsSurLigne: number[] = new Array(DIMENSION_LIGNE_COLONNE);
    private nombreMotsSurColonne: number[] = new Array(DIMENSION_LIGNE_COLONNE);


    public static creerInstanceAvecJSON(jsonGrille: string): Grille {        
        let jsonEnGrille = (JSON.parse(jsonGrille) as Grille);  
        
        let vraieGrille: Grille = new Grille(Niveau.facile);
        
        Object.assign(vraieGrille, jsonEnGrille);

        let vraiEmplacementsMot: EmplacementMot[] = this.creerInstanceAvecJSONEmplacementMots(jsonEnGrille);


        vraieGrille.modifierEmplacementsMot(vraiEmplacementsMot);


        return vraieGrille;
    }

    private static creerInstanceAvecJSONEmplacementMots(jsonEnGrille: Grille): EmplacementMot[] {
        let vraiEmplacementsMot: EmplacementMot[] = new Array();
        let vraieEmplacementMot: EmplacementMot;
        for(let emplacementMotCourant of jsonEnGrille.emplacementMots) {
            vraieEmplacementMot = new EmplacementMot();
            Object.assign(vraieEmplacementMot, emplacementMotCourant as EmplacementMot);

            vraieEmplacementMot.modifierCases(this.creerInstanceAvecJSONCasesEmplacementMots(vraieEmplacementMot));
            vraiEmplacementsMot.push(vraieEmplacementMot);
        }

        return vraiEmplacementsMot;
    }

    public static creerInstanceAvecJSONCasesEmplacementMots(vraieEmplacementMot : EmplacementMot): Case[] {
        let vraieCasesEmplacementMot: Case[] = new Array();
        let vraieCase: Case;

        for(let caseCourante of vraieEmplacementMot.obtenirCases()) {
            vraieCase = new Case(0, 0, EtatCase.noir);
            Object.assign(vraieCase, caseCourante as Case);
            vraieCasesEmplacementMot.push(vraieCase);
        }

        return vraieCasesEmplacementMot;
    }

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
                this.casesExterne.ajouterCase(caseBlanche, i, j);
            }
        }
    }

    public copieGrille(): Grille {
        let newGrille: Grille = new Grille(this.niveau);
        newGrille.etat = this.etat;
        newGrille.nombreMotsSurColonne = this.nombreMotsSurColonne;
        newGrille.nombreMotsSurLigne = this.nombreMotsSurLigne;

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                newGrille.cases[i][j] = this.cases[i][j].copieCase();
                this.casesExterne.ajouterCase(this.casesExterne.obtenirCase(i, j).copieCase(), i, j);
            }
        }
        for (let i = 0; i < this.emplacementMots.length; i++) {
            newGrille.emplacementMots[i] = this.emplacementMots[i].copieEmplacement();
        }
        for (let i = 0; i < this.mots.length; i++) {
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
        this.casesExterne.changerEtatCase(etatCase, numeroLigne, numeroColonne);

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
                caseCourante = this.casesExterne.obtenirCase(i, j) .copieCase();
                caseCourante = this.cases[i][j].copieCase();
                

                if ((caseCourante.obtenirEtat() === EtatCase.vide) && caseDebut === undefined) {
                    caseDebut = caseCourante.copieCase();
                }

                if (caseDebut !== undefined) {
                    casesEmplacementMot.push(caseCourante);
                }

                if (((j + 1 < DIMENSION_LIGNE_COLONNE) && (this.cases[i][j + 1].obtenirEtat() !== EtatCase.vide)) ||
                    (j + 1 === DIMENSION_LIGNE_COLONNE)) {
                    caseFin = caseCourante.copieCase();

                    if (casesEmplacementMot.length >= grandeurMotMinimum) {
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
                caseCourante = this.casesExterne.obtenirCase(i, j);
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

                    if (casesEmplacementMot.length >= grandeurMotMinimum) {
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

    public ajouterMotEmplacement(mot: MotComplet, emplacement: EmplacementMot): void {
        this.mots.push(mot);

        let positionDansLeMot = 0;
        let numeroLigneDepart: number = emplacement.obtenirCaseDebut().obtenirNumeroLigne();
        let numeroLigneFin: number = emplacement.obtenirCaseFin().obtenirNumeroLigne();
        let numeroColonneDepart: number = emplacement.obtenirCaseDebut().obtenirNumeroColonne();
        let numeroColonneFin: number = emplacement.obtenirCaseFin().obtenirNumeroColonne();

        for (const caseCourante of emplacement.obtenirCases()) {
            let ligne: number = caseCourante.obtenirNumeroLigne();
            let colonne: number = caseCourante.obtenirNumeroColonne();
            let lettreSimplifie: string = mot.obtenirLettreSimplifie(positionDansLeMot);

            this.casesExterne.remplirCase(lettreSimplifie, ligne, colonne);
            this.cases[ligne][colonne].remplirCase(lettreSimplifie);
            positionDansLeMot++;
        }
        if (numeroLigneDepart === numeroLigneFin) {
            this.nombreMotsSurLigne[numeroLigneDepart]++;
        }
        else if (numeroColonneDepart === numeroColonneFin) {
            this.nombreMotsSurColonne[numeroColonneDepart]++;
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

            let lettreSimplifie: string;
            for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
                if (this.dansLaLimiteDuMot(i, numeroLigneDepart, numeroLigneFin) && mot.estUneLettreValide(positionDansLeMot)) {
                    lettreSimplifie = mot.obtenirLettreSimplifie(positionDansLeMot);
                    this.casesExterne.remplirCase(lettreSimplifie, i, numeroColonneDepart);
                    this.cases[i][numeroColonneDepart].remplirCase(lettreSimplifie);
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
        for (let i = 0; i < this.emplacementMots.length; i++) {
            if (this.emplacementMots[i].estHorizontal()) {
                emplacementsHorizontaux.push(this.emplacementMots[i]);
            }
        }
        return emplacementsHorizontaux;
    }

    public emplacementsVerticaux(): EmplacementMot[] {
        let emplacementsVerticaux: EmplacementMot[] = new Array();
        for (let i = 0; i < this.emplacementMots.length; i++) {
            if (this.emplacementMots[i].estVertical()) {
                emplacementsVerticaux.push(this.emplacementMots[i]);
            }
        }
        return emplacementsVerticaux;
    }

    public genererEmplacementsAlterne(): EmplacementMot[] {
        let tableauEmplacementsHorizontaux: EmplacementMot[] = this.emplacementsHorizontaux();
        let tableauEmplacementsVerticaux: EmplacementMot[] = this.emplacementsVerticaux();
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



    public genererEmplacementsNonComplet(): EmplacementMot[] {
        let emplacementsNonComplets: EmplacementMot[] = new Array();
        for (let emplacementCourant of this.emplacementMots) {
            let estComplet: boolean = true;
            for (let i = 0; i < emplacementCourant.obtenirCases().length; i++) {
                // On perd la liaison entre l emplacement et la case alors on utilise les coord de l emplacement et on se refere a la grille
                let ligne = emplacementCourant.obtenirCase(i).obtenirNumeroLigne();
                let colonne = emplacementCourant.obtenirCase(i).obtenirNumeroColonne();
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

    public genererEmplacementPlusDeContraintes(): EmplacementMot {
        let emplacementsNonComplet = this.genererEmplacementsNonComplet();
        let emplacementsPlusDeContrainte: EmplacementMot;
        let maxPointsContrainte: number = -1;
        for (let emplacementCourant of emplacementsNonComplet) {
            let pointsContrainte: number = 0;
            for (let j = 0; j < emplacementCourant.obtenirCases().length; j++) {
                // On perd la liaison entre l emplacement et la case alors on utilise les coord de l emplacement et on se refere a la grille
                let ligne = emplacementCourant.obtenirCase(j).obtenirNumeroLigne();
                let colonne = emplacementCourant.obtenirCase(j).obtenirNumeroColonne();
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
        let indiceEmplacementsNonComplets: number[] = new Array();
        for (let indice = 0; indice < this.emplacementMots.length; indice++) {
            let estComplet: boolean = true;
            for (let i = 0; i < this.emplacementMots[indice].obtenirCases().length; i++) {
                // On perd la liaison entre l emplacement et la case alors on utilise les coord de l emplacement et on se refere a la grille
                let ligne = this.emplacementMots[indice].obtenirCase(i).obtenirNumeroLigne();
                let colonne = this.emplacementMots[indice].obtenirCase(i).obtenirNumeroColonne();
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
        let indiceEmplacementsNonComplet = this.genererEmplacementsNonCompletIndice();
        let indiceEmplacementPlusDeContrainte: number;
        let maxPointsContrainte: number = -1;
        for (let indice of indiceEmplacementsNonComplet) {
            let pointsContrainte: number = 0;
            for (let j = 0; j < this.emplacementMots[indice].obtenirCases().length; j++) {
                // On perd la liaison entre l emplacement et la case alors on utilise les coord de l emplacement et on se refere a la grille
                let ligne = this.emplacementMots[indice].obtenirCase(j).obtenirNumeroLigne();
                let colonne = this.emplacementMots[indice].obtenirCase(j).obtenirNumeroColonne();
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
        let chaine: string = "";
        for (let i = 0; i < emplacement.obtenirCases().length; i++) {
            let ligne = emplacement.obtenirCase(i).obtenirNumeroLigne();
            let colonne = emplacement.obtenirCase(i).obtenirNumeroColonne();
            chaine += this.obtenirCase(ligne, colonne).obtenirLettre();
        }
        let mot = this.trouverMotAPartirString(chaine);
        return mot;

    }

    public trouverMotAPartirString(lettres: string): MotComplet {
        for (let i = 0; i < this.mots.length; i++) {
            if (lettres === this.mots[i].lettres) {
                return this.mots[i];
            }
        }
        throw new Error("Le mot de cet emplacement est erroné");
    }

    public trouverIndiceEmplacement(emplacement: EmplacementMot): number {
        for (let indice = 0; indice < this.emplacementMots.length; indice++) {
            if(emplacement.estEgale(this.emplacementMots[indice])) {
                return indice;
            }
        }
        return -1;
    }

    public affichageConsole(): void {
        console.log("-----------------------");
        let ligne: string[] = new Array();
        let buffer: string = '';
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {

                ligne.push(this.casesExterne.obtenirCase(i, j).obtenirLettre());
            }
            for (let k = 0; k < ligne.length; k++) {
                if (ligne[k] !== undefined) {
                    buffer += " " + ligne[k] + " ";
                }
                else {
                    buffer += ' * ';
                }
            }
            console.log(buffer);
            buffer = "";
            ligne = new Array();
        }
        console.log("-----------------------");
    }
}
