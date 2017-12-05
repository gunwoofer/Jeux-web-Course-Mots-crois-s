import { EmplacementMot } from '../../../../commun/emplacementMot';

export const COULEUR_NOIRE = '#000000';

export class IndiceMot {
    public indexFixe: number;
    public definition: string;
    public guidIndice: string;
    public tailleMot: number;
    public sens: number; // False = horizontal, True = vertical
    public positionI: number;
    public positionJ: number;
    public motTrouve: string;
    public couleur: string;

    constructor(emplacementMot: EmplacementMot, definition: string) {
        this.definition = definition;
        this.guidIndice = emplacementMot.GuidIndice;
        this.indexFixe = emplacementMot.obtenirIndexFixe() + 1;
        this.tailleMot = emplacementMot.obtenirGrandeur();
        this.sens = emplacementMot.obtenirPosition();
        this.positionI = emplacementMot.obtenirCaseDebut().obtenirNumeroColonne() + 1;
        this.positionJ = emplacementMot.obtenirCaseDebut().obtenirNumeroLigne() + 1;
        this.motTrouve = '';
        this.couleur = COULEUR_NOIRE;
    }

    public modifierCouleurMot(couleur: string) {
        this.couleur = couleur;
    }
}
