import { Indice } from './indice';

export enum Rarete {
    commun,
    nonCommun
}

export class MotComplet {
    public lettres: string;
    private rarete: Rarete;
    public indice: Indice;

    public constructor(lettres: string, indice: Indice) {
        this.lettres = lettres.toUpperCase();
        this.indice = indice;
    }

    public copieMot(): MotComplet {
        const newMot = new MotComplet(this.lettres, this.indice.copieIndice());
        return newMot;
    }


    public estUneLettreValide(position: number): boolean {
        if ((this.lettres[position] === '-') || (this.lettres[position] === '\'')) {
            return false;
        }

        return true;
    }

    public setRarete(rarete: Rarete): void {
        this.rarete = rarete;
    }


    public obtenirIndice(): Indice {
        return this.indice;
    }

    public obtenirRarete(): Rarete {
        return this.rarete;
    }

    public obtenirLettreSimplifie(position: number): string {
        if (this.lettres[position] !== undefined) {
            return this.lettres[position].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        return '';
    }

    public obtenirLettre(position: number): string {
        return this.lettres.charAt(position);
    }

    public obtenirLettres(): string {
        return this.lettres;
    }

    public estEgale(mot: string): boolean {
        if (this.obtenirLettres() === mot) {
            return true;
        }
        return false;
    }
}
