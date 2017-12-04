/**
 * Classe d'indice coté client
 */
import {EmplacementMot} from '../../../../commun/emplacementMot';

export class IndiceMot {
    public indexFixe: number;
    public definition: string;
    public guidIndice: string;
    public tailleMot: number;
    public sens: number; // False = horizontal, True = vertical
    public positionI: number;
    public positionJ: number;
    public motTrouve: string;
    public couleur = '#000000';

    /*constructor(guidIndice: string, indexFixe: number, definition: string, tailleMot: number, sens: number,
                positionI: number, positionJ: number, motTrouve: string = '') {
      this.guidIndice = guidIndice;
      this.indexFixe = indexFixe;
      this.definition = definition;
      this.tailleMot = tailleMot;
      this.sens = sens;
      this.positionI = positionI;
      this.positionJ = positionJ;
      this.motTrouve = motTrouve;
    }*/

    constructor(emplacementMot: EmplacementMot, definition: string) {
        this.definition = definition;
        this.guidIndice = emplacementMot.GuidIndice;
        this.indexFixe = emplacementMot.obtenirIndexFixe() + 1;
        this.tailleMot = emplacementMot.obtenirGrandeur();
        this.sens = emplacementMot.obtenirPosition();
        this.positionI = emplacementMot.obtenirCaseDebut().obtenirNumeroColonne() + 1;
        this.positionJ = emplacementMot.obtenirCaseDebut().obtenirNumeroLigne() + 1;
        this.motTrouve = '';
    }

    public modifierCouleurMot(couleur: string) {
        this.couleur = couleur;
    }
}
