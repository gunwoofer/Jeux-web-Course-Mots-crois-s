import { EmplacementMot } from './EmplacementMot';
import { Case, EtatCase } from './Case';
import { Cases } from './Cases';
import { DIMENSION_LIGNE_COLONNE } from '../server/app/Grille';
import { Position } from './Position';
import { grandeurMotMinimum } from './constantes/GrilleConstantes';

export class EmplacementsMots {
    public emplacementMots: EmplacementMot[] = new Array();

    public emplacementsHorizontaux(): EmplacementMot[] {
        const emplacementsHorizontaux: EmplacementMot[] = new Array();
        for (let i = 0; i < this.emplacementMots.length; i++) {
            if (this.emplacementMots[i].estHorizontal()) {
                emplacementsHorizontaux.push(this.emplacementMots[i]);
            }
        }
        return emplacementsHorizontaux;
    }
    
    public ObtenirEmplacementMotSelonEmplacementMot(emplacementMot: EmplacementMot) {
        for (const emplacement of this.emplacementMots) {
            if (emplacement.estPareilQue(emplacementMot)) {
                return emplacement;
            }
        }
    }
    
    public obtenirEmplacementMot(caseDebut: Case, caseFin: Case): EmplacementMot {
        for (const emplacementMot of this.emplacementMots) {
            if (emplacementMot.estLeBonEmplacementMot(caseDebut, caseFin)) {
                return emplacementMot;
            }
        }
        return undefined;
    }
    
    public verifierMot(cases: Cases, motAVerifier: string, caseDebut: Case, caseFin: Case): boolean {
        let casesEmplacementMot: Case[] = new Array();
        for (const emplacementMot of this.emplacementMots) {
            casesEmplacementMot = cases.obtenirCasesSelonCaseDebut(emplacementMot.obtenirCaseDebut(),
                emplacementMot.obtenirPosition(), emplacementMot.obtenirGrandeur());
            if (emplacementMot.estLeBonEmplacementMot(caseDebut, caseFin) &&
                cases.obtenirMotDesCases(casesEmplacementMot) === motAVerifier && !emplacementMot.aEteTrouve()) {
                emplacementMot.estTrouve();
                return true;
            }
        }
        return false;
    }

    public genererEmplacementsSelonPosition(cases: Cases, position: Position): void {
        let caseCourante: Case;
        let caseDebut: Case;
        let longueurMot = 0;
        let etatDeLaCaseProchaine: EtatCase;

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {

                caseCourante = (position === Position.Ligne) ? cases.obtenirCase(i, j).copieCase() : 
                                                                cases.obtenirCase(j, i).copieCase();
                if ((caseCourante.obtenirEtat() === EtatCase.vide) && caseDebut === undefined) {
                    caseDebut = caseCourante.copieCase();
                }

                if (j + 1 < DIMENSION_LIGNE_COLONNE) {
                    etatDeLaCaseProchaine = (position === Position.Ligne) ? cases.obtenirCase(i, j + 1).obtenirEtat() :
                                                                            cases.obtenirCase(j + 1, i).obtenirEtat();
                }

                longueurMot++;

                if ((etatDeLaCaseProchaine !== EtatCase.vide) || (j + 1 === DIMENSION_LIGNE_COLONNE)) {

                    if (longueurMot >= grandeurMotMinimum) {
                        this.emplacementMots.push(new EmplacementMot(caseDebut, caseCourante.copieCase()));
                    }

                    // Comme la prochaine case ne peut accueillir une lettre,
                    // on doit remettre les variables à leurs valeurs initales.
                    caseDebut = undefined;
                    longueurMot = 0;
                }
            }
        }
    }
}