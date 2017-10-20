import { MotComplet } from './MotComplet';
import { Indice } from './Indice';
import { Cases } from '../../commun/Cases';
import { Case } from '../../commun/Case';
import { Position } from '../../commun/Position';
export const DIMENSION_LIGNE_COLONNE = 10;

export class MotsComplet {
    private mots: MotComplet[] = new Array();

    public ajouterMot(mot: MotComplet): void {
        this.mots.push(mot);
    }

    public recupererIndices(): Indice[] {
        const tableauIndices: Indice[] = new Array();
        for (const mot of this.mots) {
            tableauIndices.push(mot.obtenirIndice());
        }
        return tableauIndices;
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

    public contientDejaLeMot(mot: MotComplet): boolean {
        for (const motCourant of this.mots) {
            if (motCourant.obtenirLettres() === mot.obtenirLettres()) {
                return true;
            }
        }
        return false;


    }


    public trouverMeilleurPositionIndexDebut(grandeurMot: number, positionCourante: number, position: Position, cases: Cases): number {
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
                caseCourante = cases.obtenirCaseSelonPosition(position, positionCourante, positionIndexCaseCourante);

                pointageCourant += caseCourante.obtenirPointsDeContraintes();
            }

            if (i === 0 || meilleurPointage > pointageCourant) {
                meilleurPositionIndexDebut = positionCaseIndexDebut;
                meilleurPointage = pointageCourant;
            }
        }

        return meilleurPositionIndexDebut;
    }


    private obtenirLaPositionDeLaPremiereLettreLimiteDuMot(grandeurMot: number): number {
        return DIMENSION_LIGNE_COLONNE - grandeurMot + 1;
    }
}
