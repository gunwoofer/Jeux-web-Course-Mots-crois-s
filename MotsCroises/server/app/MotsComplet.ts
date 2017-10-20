import { MotComplet } from './MotComplet';
import { Indice } from './Indice';

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
}