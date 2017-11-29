import { Case } from './../../commun/Case';
import { EtatCase } from '../../commun/Case';
import { Grille, DIMENSION_LIGNE_COLONNE } from './Grille';
import * as grilleConstantes from '../../commun/constantes/GrilleConstantes';
import { Niveau } from '../../commun/Niveau';

const MAX_CONTRAINTES = 1;
const MAX_ESSAIS = 1000;

export class GenerateurDeGrilleVide {

    public genereGrilleVide(niveau: Niveau): Grille {
        let grilleVide = new Grille(niveau);
        try {
            grilleVide = this.genererEmplacementsMotsLigne(grilleVide);
            grilleVide = this.genererEmplacementsMotsColonne(grilleVide);
            // grilleVide = this.rechercheMotDeuxLettres(grilleVide);
        } catch (e) {
            grilleVide = this.genereGrilleVide(niveau);
        }
        grilleVide.genererEmplacementsMot();
        return grilleVide;
    }

    public affichageConsole(grille: Grille): void {
        let nombrePleine = 0;
        for (let i = 0; i < 10; i++) {
            let ligne: string;
            ligne = '';
            for (let j = 0; j < 10; j++) {
                const caseGrille: Case = grille.cases.obtenirCase(i, j);
                if (caseGrille.etat === EtatCase.noir) {
                    ligne += '#';
                } else {
                    ligne += '.';
                }
                if (caseGrille.etat === EtatCase.pleine) {
                    nombrePleine++;
                }
            }
            console.log(ligne);
        }
    }

    public genererEmplacementsMotsLigne(grilleVide: Grille): Grille {
        let nEssais = 0;
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const tailleMot = this.nombreAleatoireEntreXEtY(grilleConstantes.grandeurMotMinimum, grilleConstantes.grandeurMotMaximum);
            const debutEmplacementMot = this.nombreAleatoireEntreXEtY(0, DIMENSION_LIGNE_COLONNE - tailleMot);
            if (this.testContraintesMotAuDessus(grilleVide, debutEmplacementMot, tailleMot, i)) {
                grilleVide = this.creerEmplacementMotLigne(i, grilleVide, debutEmplacementMot, tailleMot);
            } else {
                nEssais++;
                i--;
            }
            if (nEssais > MAX_ESSAIS) {
                throw new Error ('Generer Emplacement de Mot Ligne impossible');
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
            grilleVide.cases.obtenirCase(posLigne, i).etat = EtatCase.vide;
        }
        return grilleVide;
    }

    public genererEmplacementsMotsColonne(grilleVide: Grille): Grille {
        let nEssais = 0;
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const tailleMot = this.nombreAleatoireEntreXEtY(grilleConstantes.grandeurMotMinimum, grilleConstantes.grandeurMotMaximum);
            const debutEmplacementMot = this.nombreAleatoireEntreXEtY(0, DIMENSION_LIGNE_COLONNE - tailleMot);
            if (this.testContraintesMotAGauche(grilleVide, debutEmplacementMot, tailleMot, i)) {
                grilleVide = this.creerEmplacementMotColonne(i, grilleVide, debutEmplacementMot, tailleMot);
            } else {
                nEssais++;
                i--;
            }
            if (nEssais > MAX_ESSAIS) {
                throw new Error ('Generer Emplacement de Mot Colonne impossible');
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
            grilleVide.cases.obtenirCase(i, posColonne).etat = EtatCase.vide;
        }
        return grilleVide;
    }

    public rechercheMotDeuxLettres(grilleVide: Grille): Grille {
        const tailleEchantillon = 4;
        for (let ligne = 0; ligne < DIMENSION_LIGNE_COLONNE; ligne++) {
            for (let colonne = 0; colonne < DIMENSION_LIGNE_COLONNE; colonne++) {
                if (colonne <= DIMENSION_LIGNE_COLONNE - tailleEchantillon) {
                    if (grilleVide.cases.obtenirCase(ligne, colonne).obtenirEtat() === EtatCase.noir &&
                    grilleVide.cases.obtenirCase(ligne, colonne + 1).etat === EtatCase.vide &&
                    grilleVide.cases.obtenirCase(ligne, colonne + 2).etat === EtatCase.vide &&
                    grilleVide.cases.obtenirCase(ligne, colonne + 3).etat === EtatCase.noir) {
                        grilleVide.cases.obtenirCase(ligne, colonne + 1).etat = EtatCase.noir;
                        grilleVide.cases.obtenirCase(ligne, colonne + 2).etat = EtatCase.noir;
                    }
                }
                if (ligne <= DIMENSION_LIGNE_COLONNE - tailleEchantillon) {
                    if (grilleVide.cases.obtenirCase(ligne, colonne).obtenirEtat() === EtatCase.noir &&
                    grilleVide.cases.obtenirCase(ligne + 1, colonne).etat === EtatCase.vide &&
                    grilleVide.cases.obtenirCase(ligne + 2, colonne).etat === EtatCase.vide &&
                    grilleVide.cases.obtenirCase(ligne + 3, colonne).etat === EtatCase.noir) {
                        grilleVide.cases.obtenirCase(ligne + 1, colonne).etat = EtatCase.noir;
                        grilleVide.cases.obtenirCase(ligne + 2, colonne).etat = EtatCase.noir;
                    }
                }
            }
        }
        return grilleVide;
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
