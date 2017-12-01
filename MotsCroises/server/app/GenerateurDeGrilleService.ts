import { GenerateurDeMotContrainteService } from './GenerateurDeMotContrainteService';
import { RechercheMots } from './RechercheMots';
import { EmplacementMot } from './../../commun/EmplacementMot';
import { Contrainte } from './Contrainte';
import { EtatCase } from './../../commun/Case';
import { Grille } from './Grille';
import { Niveau } from '../../commun/Niveau';
import { MotComplet } from './MotComplet';
import { Case } from '../../commun/Case';
import { GenerateurDeGrilleVide } from './GenerateurDeGrilleVide';
import { Position } from '../../commun/Position';
import { Indice } from './Indice';

export const NOMBRE_DE_GRILLE = 5;
export const PAS_DE_DEFINITION = ['Indice 1', 'Indice 2', 'Indice 3'];

export class GenerateurDeGrilleService {
    private generateurDeGrilleVide: GenerateurDeGrilleVide = new GenerateurDeGrilleVide();

    public async genererGrille(niveau: Niveau): Promise<Grille> {
        const grille = this.genererGrilleMotSync(niveau);
        let nEmplacement = 0;
        for (const mot of grille.mots) {
            const generateurDeMotApi = new GenerateurDeMotContrainteService();
            const motAPI: MotComplet = await generateurDeMotApi.demanderMotsADatamuse(mot.lettres);
            const emplacementsTries = this.trierEmplacements(grille.obtenirEmplacementsMot());
            mot.indice.definitions = motAPI.indice.definitions;
            mot.indice.id = motAPI.indice.id;
            emplacementsTries[nEmplacement].GuidIndice = mot.indice.id;
            grille.modifierEmplacementsMot(emplacementsTries);
            nEmplacement++;
        }
        return grille;
    }

    private trierEmplacements(emplacements: EmplacementMot[]): EmplacementMot[] {
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

    private genererTableauContraintes(grille: Grille, emplacement: EmplacementMot): Contrainte[] {
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

    private remplirGrilleSync(niveau: Niveau, grille: Grille): Grille {
        const emplacements: EmplacementMot[] = this.trierEmplacements(grille.obtenirEmplacementsMot());
        for (const emplacement of emplacements) {
            const tailleMot = emplacement.obtenirGrandeur();
            const contraintes = this.genererTableauContraintes(grille, emplacement);
            const chaineMot =  RechercheMots.rechercherMot(tailleMot, contraintes);
            if (chaineMot === undefined) {
                return undefined;
            } else {
                let mot: MotComplet;
                mot = new MotComplet(chaineMot, new Indice(PAS_DE_DEFINITION));
                emplacement.attribuerGuidIndice('Pas d\'indice...');
                grille.ajouterMotEmplacement(mot, emplacement);
            }
        }
        return grille;
    }

    public genererGrilleMotSync(niveau: Niveau): Grille {
        let grille: Grille;
        while (true) {
            const grilleVide = this.generateurDeGrilleVide.genereGrilleVide(niveau);
            grille = this.remplirGrilleSync(niveau, grilleVide);
            if (grille !== undefined) {
                break;
            }
        }
        return grille;
    }
}
