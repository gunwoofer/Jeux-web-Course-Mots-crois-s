import { GestionnaireParametresGrilleService } from './gestionnaireParametresGrilleService';
import { GenerateurDeMotContrainteService } from './generateurDeMotContrainteService';
import { RechercheMots } from './rechercheMots';
import { EmplacementMot } from './../../commun/EmplacementMot';
import { Grille } from './grille';
import { Niveau } from '../../commun/Niveau';
import { MotComplet } from './motComplet';
import { GenerateurDeGrilleVide } from './generateurDeGrilleVide';
import { Indice } from './indice';

export const NOMBRE_DE_GRILLE = 5;
export const PAS_DE_DEFINITION = ['Indice 1', 'Indice 2', 'Indice 3'];

export class GenerateurDeGrilleService {
    public async genererGrille(niveau: Niveau): Promise<Grille> {
        const grille = this.genererGrilleMotSync(niveau);
        let nEmplacement = 0;
        for (const mot of grille.mots) {
            const motAPI: MotComplet = await new GenerateurDeMotContrainteService().demanderMotsADatamuse(mot.lettres);
            const emplacementsTries = GestionnaireParametresGrilleService.trierEmplacements(grille.obtenirEmplacementsMot());
            mot.indice.definitions = motAPI.indice.definitions;
            mot.indice.id = motAPI.indice.id;
            emplacementsTries[nEmplacement].GuidIndice = mot.indice.id;
            grille.modifierEmplacementsMot(emplacementsTries);
            nEmplacement++;
        }
        return grille;
    }

    private remplirGrilleSync(niveau: Niveau, grille: Grille): Grille {
        const emplacements: EmplacementMot[] = GestionnaireParametresGrilleService.trierEmplacements(grille.obtenirEmplacementsMot());
        const motsDeLaGrille: string[] = new Array();
        for (const emplacement of emplacements) {
            const chaineMot =  RechercheMots.rechercherMot(emplacement.obtenirGrandeur(),
                                GestionnaireParametresGrilleService.genererTableauContraintes(grille, emplacement));
            motsDeLaGrille.push(chaineMot);
            if (chaineMot === undefined) {
                return undefined;
            } else {
                emplacement.attribuerGuidIndice('Pas d\'indice...');
                grille.ajouterMotEmplacement(new MotComplet(chaineMot, new Indice(PAS_DE_DEFINITION)), emplacement);
            }
        }
        if (this.contientUnDoublon(motsDeLaGrille)) {
            return undefined;
        }
        return grille;
    }

    private contientUnDoublon(motsDeLaGrille: string[]): boolean {
        for (const motAComparer of motsDeLaGrille) {
            let nMotsSimilaires = 0;
            for (const motGrille of motsDeLaGrille) {
                if (motAComparer === motGrille) {
                    nMotsSimilaires++;
                }
            }
            if (nMotsSimilaires > 1) {
                return true;
            }
        }
        return false;
    }

    public genererGrilleMotSync(niveau: Niveau): Grille {
        let grille: Grille;
        while (true) {
            grille = this.remplirGrilleSync(niveau, new GenerateurDeGrilleVide().genereGrilleVide(niveau));
            if (grille !== undefined) {
                break;
            }
        }
        return grille;
    }
}
