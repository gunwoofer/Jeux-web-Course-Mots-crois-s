import { Contrainte } from './Contrainte';
import { Grille } from './Grille';
import { EmplacementMot } from './../../commun/EmplacementMot';
import { Position } from '../../commun/Position';
import { Case, EtatCase } from '../../commun/Case';

export class GestionnaireParametresGrilleService {
    public static trierEmplacements(emplacements: EmplacementMot[]): EmplacementMot[] {
        const emplacementsLignes: EmplacementMot[] = new Array();
        const emplacementsColonnes: EmplacementMot[] = new Array();
        for (const emplacement of emplacements) {
            if (emplacement.obtenirPosition() === Position.Colonne) {
                emplacementsColonnes.push(emplacement);
            } else {
                emplacementsLignes.push(emplacement);
            }
        }
        let emplacementsTries: EmplacementMot[] = new Array();
        const tailleMinimumTableau = Math.min(emplacementsColonnes.length, emplacementsLignes.length);
        for (let i = 0; i < tailleMinimumTableau; i++) {
            emplacementsTries.push(emplacementsLignes[i]);
            emplacementsTries.push(emplacementsColonnes[i]);
        }
        if (emplacementsColonnes.length > tailleMinimumTableau) {
            emplacementsTries = emplacementsTries.concat(emplacementsColonnes.splice(
                                                                                    tailleMinimumTableau - 1,
                                                                                    emplacementsColonnes.length - 1));
        }
        if (emplacementsLignes.length > tailleMinimumTableau) {
            emplacementsTries = emplacementsTries.concat(emplacementsLignes.splice(
                                                                                    tailleMinimumTableau - 1,
                                                                                    emplacementsLignes.length - 1));
        }
        return emplacementsTries;
    }

    public static genererTableauContraintes(grille: Grille, emplacement: EmplacementMot): Contrainte[] {
        const tableauContraintes: Contrainte[] = new Array();
        const ligneDepart: number = emplacement.obtenirCaseDebut().obtenirNumeroLigne();
        const colonneDepart: number = emplacement.obtenirCaseDebut().obtenirNumeroColonne();
        const position: Position = emplacement.obtenirPosition();
        for (let i = 0; i < emplacement.obtenirGrandeur(); i++) {
            let caseCourrante: Case;
            if (position === Position.Ligne) {
                caseCourrante = grille.cases.obtenirCase(ligneDepart, colonneDepart + i);
            } else {
                caseCourrante = grille.cases.obtenirCase(ligneDepart + i, colonneDepart);
            }
            if (caseCourrante.obtenirEtat() === EtatCase.pleine) {
                const contrainte = new Contrainte(caseCourrante.obtenirLettre(), i);
                tableauContraintes.push(contrainte);
            }
        }
        return tableauContraintes;
    }
}
