import { GestionnaireParametresGrilleService } from './gestionnaireParametresGrilleService';
import { GenerateurDeMotContrainteService } from './GenerateurDeMotContrainteService';
import { RechercheMots } from './RechercheMots';
import { EmplacementMot } from './../../commun/EmplacementMot';
import { Grille } from './Grille';
import { Niveau } from '../../commun/Niveau';
import { MotComplet } from './MotComplet';
import { GenerateurDeGrilleVide } from './GenerateurDeGrilleVide';
import { Indice } from './Indice';

export const NOMBRE_DE_GRILLE = 5;
export const PAS_DE_DEFINITION = ['Indice 1', 'Indice 2', 'Indice 3'];

export class GenerateurDeGrilleService {
    public async genererGrille(niveau: Niveau): Promise<Grille> {
        const grille = this.genererGrilleMotSync(niveau);
        let nEmplacement = 0;
        for (const mot of grille.mots) {
            const generateurDeMotApi = new GenerateurDeMotContrainteService();
            const motAPI: MotComplet = await generateurDeMotApi.demanderMotsADatamuse(mot.lettres);
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
        for (const emplacement of emplacements) {
            const chaineMot =  RechercheMots.rechercherMot(emplacement.obtenirGrandeur(),
                                GestionnaireParametresGrilleService.genererTableauContraintes(grille, emplacement));
            if (chaineMot === undefined) {
                return undefined;
            } else {
                emplacement.attribuerGuidIndice('Pas d\'indice...');
                grille.ajouterMotEmplacement(new MotComplet(chaineMot, new Indice(PAS_DE_DEFINITION)), emplacement);
            }
        }
        return grille;
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
