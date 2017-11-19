import { Grille, DIMENSION_LIGNE_COLONNE } from './Grille';
import { Niveau } from '../../commun/Niveau';
import { MotComplet, Rarete } from './MotComplet';
import { Case, EtatCase } from '../../commun/Case';
import { Position } from '../../commun/Position';
import { Indice, DifficulteDefinition } from './Indice';
import * as grilleConstantes from './GrilleConstants';

export const NOMBRE_DE_GRILLE = 5;

// Pour le tableau de position de la case : [NUMERO_LIGNE_DEBUT, NUMERO_COLONNE_DEBUT, NUMERO_LIGNE_FIN, NUMERO_COLONNE_FIN]
const NUMERO_LIGNE_DEBUT = 0;
const NUMERO_COLONNE_DEBUT = 1;
const NUMERO_LIGNE_FIN = 2;
const NUMERO_COLONNE_FIN = 3;

export class GenerateurDeGrilleService {
    protected motCroiseGenere: Grille;

    public genererGrille(niveau: Niveau): Grille {
        this.motCroiseGenere = this.genereGrilleVide(niveau);
        this.motCroiseGenere = this.remplirGrille(niveau);

        return this.motCroiseGenere;
    }

    public obtenirGrillesBase(): Grille[] {
        const grillesFacileObtenue: Grille[] = this.obtenirGrilles(Niveau.facile);
        const grillesMoyenObtenue: Grille[] = this.obtenirGrilles(Niveau.moyen);
        const grillesDifficileObtenue: Grille[] = this.obtenirGrilles(Niveau.difficile);

        return grillesFacileObtenue.concat(grillesMoyenObtenue).concat(grillesDifficileObtenue);
    }

    private obtenirGrilles(niveau: Niveau): Grille[] {
        const grilles: Grille[] = new Array();
        for (let i = 0; i < NOMBRE_DE_GRILLE; i++) {
            grilles.push(this.genererGrille(niveau));
        }
        return grilles;
    }

    public genereGrilleVide(niveau: Niveau): Grille {
        let grilleVide = new Grille(niveau);

        // Pour chaque ligne & colonne, on créer un nombre équivaut aux nombre de mots.
        const nombreMotsParLigne: number[] = this.obtenirNombreMots();
        const nombreMotsParColonne: number[] = this.obtenirNombreMots();

        // Pour chaque mot de lignes & colonnes, on créer un nombre équivaut à la longueur du mot.
        const grandeurMotsParLigne: number[][] = this.obtenirGrandeurMots(nombreMotsParLigne);
        const grandeurMotsParColonne: number[][] = this.obtenirGrandeurMots(nombreMotsParColonne);

        // Pour chaque mot de lignes & colonnes, positionnez-le pour que celui-ci est le moins d'intersection possible.
        grilleVide = this.positionnerCases(grilleVide, grandeurMotsParLigne, grandeurMotsParColonne);

        grilleVide.genererEmplacementsMot();

        return grilleVide;
    }

    private positionnerCases(grille: Grille, grandeurMotsParLigne: number[][], grandeurMotsParColonne: number[][]): Grille {
        grille = this.ajouterCasesMeilleurEndroit(Position.Ligne, grille, grandeurMotsParLigne);
        grille = this.ajouterCasesMeilleurEndroit(Position.Colonne, grille, grandeurMotsParColonne);
        grille.calculerPointsContraintes();

        return grille;
    }

    private meilleurPositionDebutFinSeChevauchent(grille: Grille, numeroLigneDebut: number, numeroColonneDebut: number,
        numeroLigneFin: number, numeroColonneFin: number): boolean {
        const caseDebut: Case = grille.obtenirCase(numeroLigneDebut, numeroColonneDebut);
        const caseFin: Case = grille.obtenirCase(numeroLigneFin, numeroColonneFin);
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


    private ajouterCasesMeilleurEndroit(position: Position, grille: Grille, grandeurMots: number[][]): Grille {
        let numeroPosition: number[] = [0, 0, 0, 0]; // [NUMERO_LIGNE_DEBUT, NUMERO_COLONNE_DEBUT, NUMERO_LIGNE_FIN, NUMERO_COLONNE_FIN]
        let cases: Case[] = new Array();

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < grandeurMots[i].length; j++) {
                cases = new Array();
                grille.calculerPointsContraintes();
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

    private mettreAJourEtAjouterATableauCases(cases: Case[], numeroDebut: number, numeroFin: number,
            grille: Grille, position: Position, iCourant: number): void {
        let caseCouranteVide: Case;

        for (let k = numeroDebut; k <= numeroFin; k++) {
            caseCouranteVide = grille.obtenirCaseSelonPosition(position, iCourant, k);
            caseCouranteVide.etat = EtatCase.vide;
            cases.push(caseCouranteVide);
        }
    }

    private trouverMeilleurPosition(grille:Grille, positionCourante: number, position: Position, grandeurMot: number): number[] {
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


    private obtenirGrandeurMots(nombreMots: number[]): number[][] {
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

    private obtenirNombreMots(): number[] {
        const nombreMots: number[] = new Array(DIMENSION_LIGNE_COLONNE);

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const grandeurMot: number = this.nombreAleatoireEntreXEtY(grilleConstantes.nombreMotMinimumParLigneOuColonne,
                grilleConstantes.nombreMotMaximumParLigneOuColonne);

            nombreMots[i] = grandeurMot;
        }

        return nombreMots;
    }

    private remplirGrille(niveau: Niveau, toujoursMemeLettre: boolean = false): Grille {
        const grillePlein = this.motCroiseGenere;

        while (!grillePlein.estComplete()) {
            for (const emplacementMotCourant of grillePlein.obtenirEmplacementsMot()) {

                let motAjoute = false;

                while (!motAjoute) {
                    const grandeur = emplacementMotCourant.obtenirGrandeur();
                    let chaineIdiote = '';

                    if (!toujoursMemeLettre) {
                        for (let i = 0; i < grandeur; i++) {
                            chaineIdiote = chaineIdiote + grilleConstantes.lettresDeAlphabet.charAt(
                                this.nombreAleatoireEntreXEtY(1, grilleConstantes.nombreLettresDeAlphabet));
                        }
                    } else {
                        for (let i = 0; i < grandeur; i++) {
                            chaineIdiote = chaineIdiote + grilleConstantes.LETTRE_PAR_DEFAUT_A_INSERER_MOCK_GRILLE;
                        }
                    }

                    const indiceIdiot = new Indice(['definition facile', 'definition un peu difficile', 'definition dure de ouuuuf']);
                    const motIdiot: MotComplet = new MotComplet(chaineIdiote, indiceIdiot);

                    if (niveau === Niveau.facile) {
                        motIdiot.setRarete(Rarete.commun);
                        motIdiot.obtenirIndice().setDifficulteDefinition(DifficulteDefinition.PremiereDefinition);

                    }
                    if (niveau === Niveau.moyen) {
                        motIdiot.setRarete(Rarete.commun);
                        motIdiot.obtenirIndice().setDifficulteDefinition(DifficulteDefinition.DefinitionAlternative);
                    }
                    if (niveau === Niveau.difficile) {
                        motIdiot.setRarete(Rarete.nonCommun);
                        motIdiot.obtenirIndice().setDifficulteDefinition(DifficulteDefinition.DefinitionAlternative);
                    }

                    if (toujoursMemeLettre || !grillePlein.motsComplet.contientDejaLeMot(motIdiot)) {
                        grillePlein.ajouterMot(motIdiot, emplacementMotCourant.obtenirCaseDebut().obtenirNumeroLigne(),
                            emplacementMotCourant.obtenirCaseDebut().obtenirNumeroColonne(),
                            emplacementMotCourant.obtenirCaseFin().obtenirNumeroLigne(),
                            emplacementMotCourant.obtenirCaseFin().obtenirNumeroColonne());
                        motAjoute = true;
                    }
                }
            }
        }
        return grillePlein;
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
