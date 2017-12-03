import { Indice } from './indice';

export class MotComplet {
    public lettres: string;
    public indice: Indice;

    public constructor(lettres: string, indice: Indice) {
        this.lettres = lettres.toUpperCase();
        this.indice = indice;
    }

    public obtenirLettreSimplifie(position: number): string {
        if (this.lettres[position] !== undefined) {
            return this.lettres[position].normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
        return '';
    }
}
