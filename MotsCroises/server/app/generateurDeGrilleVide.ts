import { Position } from './../../commun/Position';
import { EtatCase } from './../../commun/Case';
import { Grille, DIMENSION_LIGNE_COLONNE } from './Grille';
import * as grilleConstantes from '../../commun/constantes/GrilleConstantes';
import { Niveau } from '../../commun/Niveau';

const MAX_CONTRAINTES = 1;
const MAX_ESSAIS = 1000;

export class GenerateurDeGrilleVide {
    public genereGrilleVide(niveau: Niveau): Grille {
        let grilleVide = new Grille(niveau);
        try {
            grilleVide = this.genererEmplacementsColonneEtLigne(grilleVide);
        } catch (e) {
            grilleVide = this.genereGrilleVide(niveau);
        }
        grilleVide.genererEmplacementsMot();
        return grilleVide;
    }

    private genererEmplacementsColonneEtLigne(grilleVide: Grille): Grille {
        grilleVide = this.genererEmplacementsMots(grilleVide, Position.Ligne);
        grilleVide = this.genererEmplacementsMots(grilleVide, Position.Colonne);
        return grilleVide;
    }

    public genererEmplacementsMots(grilleVide: Grille, position: Position): Grille {
        let nEssais = 0;
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const tailleMot = this.nombreAleatoireEntreXEtY(grilleConstantes.grandeurMotMinimum, grilleConstantes.grandeurMotMaximum);
            const debutEmplacementMot = this.nombreAleatoireEntreXEtY(0, DIMENSION_LIGNE_COLONNE - tailleMot);
            if (position === Position.Ligne) {
                if (this.testContraintesMotAuDessus(grilleVide, debutEmplacementMot, tailleMot, i)) {
                    grilleVide = this.creerEmplacementMot(i, grilleVide, debutEmplacementMot, tailleMot, position);
                } else {
                    nEssais++;
                    i--;
                }
            } else {
                if (this.testContraintesMotAGauche(grilleVide, debutEmplacementMot, tailleMot, i)) {
                    grilleVide = this.creerEmplacementMot(i, grilleVide, debutEmplacementMot, tailleMot, position);
                } else {
                    nEssais++;
                    i--;
                }
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

    public creerEmplacementMot(positionFixe: number, grilleVide: Grille, posDepart: number, tailleMot: number, position: Position): Grille {
        for (let i = posDepart; i < tailleMot + posDepart; i++) {
            if (position === Position.Ligne) {
                grilleVide.cases.obtenirCase(positionFixe, i).etat = EtatCase.vide;
            } else {
                grilleVide.cases.obtenirCase(i, positionFixe).etat = EtatCase.vide;
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

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
