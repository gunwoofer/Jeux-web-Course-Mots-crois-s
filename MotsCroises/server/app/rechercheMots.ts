import { ListeMotsAnglais } from './listeMotsAnglais';
import { Contrainte } from './contrainte';

export class RechercheMots {

    public static rechercherMot(taille: number, contrainteDeMots: Contrainte[]): string {
        let regEx = '[^a-z]';
        for (let i = 0; i < taille; i++) {
            let estContrainte = false;
            let lettre = '';
            for (const contrainte of contrainteDeMots) {
                if (contrainte.obtenirPositionContrainte() === i) {
                    lettre = contrainte.obtenirLettre().toLowerCase();
                    estContrainte = true;
                    break;
                }
            }
            if (estContrainte) {
                regEx += lettre;
            } else {
                regEx += '[a-z]{1}';
            }
        }
        const contrainte: RegExp = new RegExp(regEx + '\n', 'g');
        const mots: string[] = this.rechercheDansListeMots(contrainte);
        if (mots[this.nombreAleatoireEntreXEtY(0, mots.length - 1)] === undefined) {
            return undefined;
        }
        return mots[this.nombreAleatoireEntreXEtY(0, mots.length - 1)].trim();
    }

    public static rechercheMots(contrainte: RegExp): string[] {
        return this.rechercheDansListeMots(contrainte);
    }

    public static testRechercheMots(): string[] {
        return this.rechercheDansListeMots(/a[a-z]{4}\n/g);
    }

    private static rechercheDansListeMots(contrainte: RegExp): string[] {
        let myArray: RegExpExecArray;
        const motsTrouve: string[] = [];

        while ((myArray = contrainte.exec(ListeMotsAnglais.mots)) !== null) {
          let msg = 'Found ' + myArray[0] + '. ';
          msg += 'Next match starts at ' + contrainte.lastIndex;
          motsTrouve.push(myArray[0]);
        }
        return motsTrouve;
    }

    private static nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
