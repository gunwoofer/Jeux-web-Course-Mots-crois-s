import { EtatCase, Case } from '../../commun/Case';
import { Grille, DIMENSION_LIGNE_COLONNE } from './Grille';
import * as grilleConstantes from '../../commun/constantes/GrilleConstantes';
import { Position } from '../../commun/Position';

// Pour le tableau de position de la case : [NUMERO_LIGNE_DEBUT, NUMERO_COLONNE_DEBUT, NUMERO_LIGNE_FIN, NUMERO_COLONNE_FIN]
const NUMERO_LIGNE_DEBUT = 0;
const NUMERO_COLONNE_DEBUT = 1;
const NUMERO_LIGNE_FIN = 2;
const NUMERO_COLONNE_FIN = 3;
const MAX_CONTRAINTES = 2;

export class GenerateurDeGrilleVide {

    public genererEmplacementsMotsLigne(grilleVide: Grille): Grille {
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const tailleMot = this.nombreAleatoireEntreXEtY(grilleConstantes.grandeurMotMinimum, grilleConstantes.grandeurMotMaximum);
            const debutEmplacementMot = this.nombreAleatoireEntreXEtY(0, DIMENSION_LIGNE_COLONNE - tailleMot);
            if (this.testContraintesMotAuDessus(grilleVide, debutEmplacementMot, tailleMot, i)) {
                grilleVide = this.creerEmplacementMotLigne(i, grilleVide, debutEmplacementMot, tailleMot);
            } else {
                i--;
            }
        }
        return grilleVide;
    }

    private testContraintesMotAuDessus(grilleVide: Grille, positionMot: number, tailleMot: number, ligne: number): boolean {
        let nombreCasesOccupeesAuDessus = 0;
        if (ligne === 0) {
            return true;
        }
        for (let i = positionMot; i < positionMot + tailleMot; i++) {
            const caseDessus = grilleVide.cases.obtenirCase(ligne - 1, i);
            if (caseDessus.etat === EtatCase.vide) {
                nombreCasesOccupeesAuDessus++;
            }
        }
        if (nombreCasesOccupeesAuDessus > MAX_CONTRAINTES) {
            return false;
        }
        return true;
    }

    public creerEmplacementMotLigne(posLigne: number, grilleVide: Grille, posDepart: number, tailleMot: number): Grille {
        for (let i = posDepart; i < tailleMot + posDepart; i++) {
            grilleVide.cases[posLigne][i].etat = EtatCase.vide;
        }
        return grilleVide;
    }

    public genererEmplacementsMotsColonne(grilleVide: Grille): Grille {
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const tailleMot = this.nombreAleatoireEntreXEtY(grilleConstantes.grandeurMotMinimum, grilleConstantes.grandeurMotMaximum);
            const debutEmplacementMot = this.nombreAleatoireEntreXEtY(0, DIMENSION_LIGNE_COLONNE - tailleMot);
            if (this.testContraintesMotAGauche(grilleVide, debutEmplacementMot, tailleMot, i)) {
                grilleVide = this.creerEmplacementMotColonne(i, grilleVide, debutEmplacementMot, tailleMot);
            } else {
                i--;
            }
        }
        return grilleVide;
    }

    private testContraintesMotAGauche(grilleVide: Grille, positionMot: number, tailleMot: number, colonne: number): boolean {
        let nombreCasesOccupeesAGauche = 0;
        if (colonne === 0) {
            return true;
        }
        for (let i = positionMot; i < positionMot + tailleMot; i++) {
            const caseGauche = grilleVide.cases.obtenirCase(i, colonne - 1);
            if (caseGauche.etat === EtatCase.vide) {
                nombreCasesOccupeesAGauche++;
            }
        }
        if (nombreCasesOccupeesAGauche > MAX_CONTRAINTES) {
            return false;
        }
        return true;
    }

    public creerEmplacementMotColonne(posColonne: number, grilleVide: Grille, posDepart: number, tailleMot: number): Grille {
        for (let i = posDepart; i < tailleMot + posDepart; i++) {
            grilleVide.cases[i][posColonne].etat = EtatCase.vide;
        }
        return grilleVide;
    }

    public rechercheMotDeuxLettres(grilleVide: Grille): Grille {
        const tailleEchantillon = 4;
        const motDeuxLettres: EtatCase[] = [EtatCase.noir, EtatCase.vide, EtatCase.vide, EtatCase.noir];
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                if (j <= DIMENSION_LIGNE_COLONNE - tailleEchantillon) {
                    const echantillonLigne: EtatCase[] = [
                        grilleVide.cases.obtenirCase(i, j).etat,
                        grilleVide.cases.obtenirCase(i, j + 1).etat,
                        grilleVide.cases.obtenirCase(i, j + 2).etat,
                        grilleVide.cases.obtenirCase(i, j + 3).etat
                    ];
                    if (echantillonLigne === motDeuxLettres) {
                        grilleVide.cases[i][j + 1].etat = EtatCase.noir;
                        grilleVide.cases[i][j + 2].etat = EtatCase.noir;
                    }
                }
                if (i <= DIMENSION_LIGNE_COLONNE - tailleEchantillon) {
                    const echantillonColonne: EtatCase[] = [
                        grilleVide.cases.obtenirCase(i, j).etat,
                        grilleVide.cases.obtenirCase(i + 1, j).etat,
                        grilleVide.cases.obtenirCase(i + 2, j).etat,
                        grilleVide.cases.obtenirCase(i + 3, j).etat
                    ];
                    if (echantillonColonne === motDeuxLettres) {
                        grilleVide.cases[i + 1][j].etat = EtatCase.noir;
                        grilleVide.cases[i + 2][j].etat = EtatCase.noir;
                    }
                }
            }
        }
        return grilleVide;
    }

    // ----------------------------------------- //
    public obtenirNombreMots(): number[] {
        const nombreMots: number[] = new Array(DIMENSION_LIGNE_COLONNE);

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const grandeurMot: number = this.nombreAleatoireEntreXEtY(grilleConstantes.nombreMotMinimumParLigneOuColonne,
                grilleConstantes.nombreMotMaximumParLigneOuColonne);

            nombreMots[i] = grandeurMot;
        }

        return nombreMots;
    }

    public obtenirGrandeurMots(nombreMots: number[]): number[][] {
        const grandeurMots: number[][] = new Array(DIMENSION_LIGNE_COLONNE);
        let grandeurMotLigne: number;

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            grandeurMots[i] = new Array();
            grandeurMotLigne = this.nombreAleatoireEntreXEtY(grilleConstantes.grandeurMotMinimum, grilleConstantes.grandeurMotMaximum);

            grandeurMots[i].push(grandeurMotLigne);

            if (this.peutAccueillirSecondMot(nombreMots[i], grandeurMots[i][0])) {
                grandeurMots[i].push(this.obtenirGrandeurSecondMot(grandeurMots[i][0]));
            }
        }

        return grandeurMots;
    }

    public positionnerCases(grille: Grille, grandeurMotsParLigne: number[][], grandeurMotsParColonne: number[][]): Grille {
        grille = this.ajouterCasesMeilleurEndroit(Position.Ligne, grille, grandeurMotsParLigne);
        grille = this.ajouterCasesMeilleurEndroit(Position.Colonne, grille, grandeurMotsParColonne);
        grille.cases.calculerPointsContraintes();

        return grille;
    }

    private peutAccueillirSecondMot(nombreMots: number, grandeurPremierMot: number): boolean {
        const grandeurMaximumDuProchainMot: number = grilleConstantes.grandeurMotMaximum -
            grandeurPremierMot - grilleConstantes.longueurEspaceNoirEntreDeuxMots;

        return ((nombreMots === grilleConstantes.nombreMotMaximumParLigneOuColonne) &&
                (grandeurMaximumDuProchainMot >= grilleConstantes.grandeurMotMinimum));
    }

    private obtenirGrandeurSecondMot(grandeurPremierMot: number): number {
        const grandeurMaximumDuProchainMot: number = grilleConstantes.grandeurMotMaximum -
                grandeurPremierMot - grilleConstantes.longueurEspaceNoirEntreDeuxMots;

        return this.nombreAleatoireEntreXEtY(grilleConstantes.grandeurMotMinimum, grandeurMaximumDuProchainMot);
    }


    private ajouterCasesMeilleurEndroit(position: Position, grille: Grille, grandeurMots: number[][]): Grille {
        let numeroPosition: number[] = [0, 0, 0, 0]; // [NUMERO_LIGNE_DEBUT, NUMERO_COLONNE_DEBUT, NUMERO_LIGNE_FIN, NUMERO_COLONNE_FIN]
        let cases: Case[] = new Array();

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < grandeurMots[i].length; j++) {
                cases = new Array();
                grille.cases.calculerPointsContraintes();
                numeroPosition = this.trouverMeilleurPosition(grille, i, position, grandeurMots[i][j]);

                // Vérifier si le mot chevauche un autre présent sur la même colonne | même ligne.
                if (!this.meilleurPositionDebutFinSeChevauchent(grille, numeroPosition[NUMERO_LIGNE_DEBUT],
                        numeroPosition[NUMERO_COLONNE_DEBUT], numeroPosition[NUMERO_LIGNE_FIN], numeroPosition[NUMERO_COLONNE_FIN]) ||
                    j === 0) {

                    // Changer l'état des cases à vide.
                    if (position === Position.Ligne) {
                        this.mettreAJourEtAjouterATableauCases(cases, numeroPosition[NUMERO_COLONNE_DEBUT],
                            numeroPosition[NUMERO_COLONNE_FIN], grille, position, i);
                    } else if (position === Position.Colonne) {
                        this.mettreAJourEtAjouterATableauCases(cases, numeroPosition[NUMERO_LIGNE_DEBUT],
                            numeroPosition[NUMERO_LIGNE_FIN], grille, position, i);
                    }
                }
            }
        }

        return grille;
    }

    private trouverMeilleurPosition(grille: Grille, positionCourante: number, position: Position, grandeurMot: number): number[] {
        const meilleurPosition: number[] = [0, 0, 0, 0]; // [NUMERO_LIGNE_DEBUT, NUMERO_COLONNE_DEBUT, NUMERO_LIGNE_FIN, NUMERO_COLONNE_FIN]
        let meilleurPositionIndex: number;

        // Position dans la ligne courante.
        meilleurPosition[(position === Position.Ligne) ? NUMERO_LIGNE_DEBUT : NUMERO_COLONNE_DEBUT] = positionCourante;
        meilleurPosition[(position === Position.Ligne) ? NUMERO_LIGNE_FIN : NUMERO_COLONNE_FIN] = positionCourante;

        // trouver la meilleur position.
        meilleurPositionIndex = grille.motsComplet.trouverMeilleurPositionIndexDebut(
            grandeurMot, positionCourante, position, grille.cases);

        // assignation des positions.
        meilleurPosition[(position === Position.Ligne) ? NUMERO_COLONNE_DEBUT : NUMERO_LIGNE_DEBUT] = meilleurPositionIndex;
        meilleurPosition[(position === Position.Ligne) ? NUMERO_COLONNE_FIN : NUMERO_LIGNE_FIN] = meilleurPositionIndex + grandeurMot - 1;

        return meilleurPosition;
    }

    private meilleurPositionDebutFinSeChevauchent(grille: Grille, numeroLigneDebut: number, numeroColonneDebut: number,
        numeroLigneFin: number, numeroColonneFin: number): boolean {
        const caseDebut: Case = grille.cases.obtenirCase(numeroLigneDebut, numeroColonneDebut);
        const caseFin: Case = grille.cases.obtenirCase(numeroLigneFin, numeroColonneFin);
        let casesEmplacementMot: Case[];

        for (const emplacementMotCourant of grille.obtenirEmplacementsMot()) {
            casesEmplacementMot = grille.obtenirCasesSelonCaseDebut(emplacementMotCourant.obtenirCaseDebut(),
                emplacementMotCourant.obtenirPosition(), emplacementMotCourant.obtenirGrandeur());

            for (const caseCourante of casesEmplacementMot) {
                if (this.caseAMemeLigneColonneQueCaseB(caseCourante, caseDebut)) {
                    return true;
                }
                if (this.caseAMemeLigneColonneQueCaseB(caseCourante, caseFin)) {
                    return true;
                }
            }
        }

        return false;
    }

    private caseAMemeLigneColonneQueCaseB(caseA: Case, caseB: Case): boolean {
        if ((caseA.obtenirNumeroLigne() === caseB.obtenirNumeroLigne()) &&
                (caseA.obtenirNumeroColonne() === caseB.obtenirNumeroColonne())) {
            return true;
        }

        return false;
    }

    private mettreAJourEtAjouterATableauCases(cases: Case[], numeroDebut: number, numeroFin: number,
            grille: Grille, position: Position, iCourant: number): void {
        let caseCouranteVide: Case;

        for (let k = numeroDebut; k <= numeroFin; k++) {
            caseCouranteVide = grille.cases.obtenirCaseSelonPosition(position, iCourant, k);
            caseCouranteVide.etat = EtatCase.vide;
            cases.push(caseCouranteVide);
        }
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
