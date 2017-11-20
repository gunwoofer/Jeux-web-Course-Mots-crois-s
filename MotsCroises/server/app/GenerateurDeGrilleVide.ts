import { EtatCase, Case } from '../../commun/Case';
import { Grille, DIMENSION_LIGNE_COLONNE } from './Grille';
import * as grilleConstantes from '../../commun/constantes/GrilleConstantes';
import { Niveau } from '../../commun/Niveau';

// Pour le tableau de position de la case : [NUMERO_LIGNE_DEBUT, NUMERO_COLONNE_DEBUT, NUMERO_LIGNE_FIN, NUMERO_COLONNE_FIN]
const MAX_CONTRAINTES = 2;

export class GenerateurDeGrilleVide {

    public genereGrilleVide(niveau: Niveau): Grille {
        let grilleVide = new Grille(niveau);
        grilleVide = this.genererEmplacementsMotsLigne(grilleVide);
        grilleVide = this.genererEmplacementsMotsColonne(grilleVide);
        grilleVide = this.rechercheMotDeuxLettres(grilleVide);
        grilleVide.genererEmplacementsMot();
        return grilleVide;
    }

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
            grilleVide.cases.obtenirCase(posLigne, i).etat = EtatCase.vide;
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
            grilleVide.cases.obtenirCase(i, posColonne).etat = EtatCase.vide;
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
                        grilleVide.cases.obtenirCase(i, j + 1).etat = EtatCase.noir;
                        grilleVide.cases.obtenirCase(i, j + 2).etat = EtatCase.noir;
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
                        grilleVide.cases.obtenirCase(i + 1, j).etat = EtatCase.noir;
                        grilleVide.cases.obtenirCase(i + 2, j).etat = EtatCase.noir;
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
