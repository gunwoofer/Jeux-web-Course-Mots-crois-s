import { MotComplet } from './motComplet';
import { Indice } from './indice';
export const DIMENSION_LIGNE_COLONNE = 10;

export class MotsComplet {
    private mots: MotComplet[] = new Array();

    public ajouterMot(mot: MotComplet): void {
        this.mots.push(mot);
    }

    public recupererIndices(): Indice[] {
        const tableauIndices: Indice[] = new Array();
        for (const mot of this.mots) {
            tableauIndices.push(mot.indice);
        }
        return tableauIndices;
    }
}
