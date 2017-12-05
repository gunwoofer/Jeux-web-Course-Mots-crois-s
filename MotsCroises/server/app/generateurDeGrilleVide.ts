import { Position } from '../../commun/position';
import { EtatCase, Case } from '../../commun/case';
import { Grille, DIMENSION_LIGNE_COLONNE } from './grille';
import * as grilleConstantes from '../../commun/constantes/grilleConstantes';
import { Niveau } from '../../commun/niveau';

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
            if (this.testContraintesMotProche(grilleVide, debutEmplacementMot, tailleMot, i, position)) {
                grilleVide = this.creerEmplacementMot(i, grilleVide, debutEmplacementMot, tailleMot, position);
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

    private testContraintesMotProche(grilleVide: Grille, positionMot: number, tailleMot: number,
                                    positionFixe: number, position: Position): boolean {
        let nombreCasesOccupeesProche = 0;
        if (positionFixe === 0) { return true; }
        for (let i = positionMot; i < positionMot + tailleMot; i++) {
            let caseProche: Case;
            if (position === Position.Colonne) {
                caseProche = grilleVide.cases.obtenirCase(i, positionFixe - 1);
            } else {
                caseProche = grilleVide.cases.obtenirCase(positionFixe - 1, i);
            }
            if (caseProche.etat === EtatCase.vide) { nombreCasesOccupeesProche++; }
        }
        if (nombreCasesOccupeesProche > MAX_CONTRAINTES) { return false; }
        return true;
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
