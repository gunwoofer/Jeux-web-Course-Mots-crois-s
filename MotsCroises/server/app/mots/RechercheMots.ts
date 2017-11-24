import { ListeMotsAnglais } from './ListeMotsAnglais';

export class RechercheMots {

    public static rechercherMot(contrainte: RegExp): string {
        const mots: string[] = this.rechercheDansListeMots(contrainte);
        return mots[this.nombreAleatoireEntreXEtY(0, mots.length - 1)];
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