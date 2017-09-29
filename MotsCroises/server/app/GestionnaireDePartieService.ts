import { Partie, TypePartie, LIMITE_JOUEURS } from './Partie';
import { Grille, Niveau } from './Grille';
import { Guid } from './Guid';

import { Joueur } from './Joueur';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';

export const NOMBRE_GRILLES_PARTIE_DYNAMIQUE = 5;
export const AUCUNE_PARTIE_CORREPSONDANT_GUID = 'Aucune partie correspondant au GUID n\'a été trouvé';

export class GestionnaireDePartieService {
    private parties: Partie[] = new Array();
    private generateurDeGrilleService: GenerateurDeGrilleService;

    constructor(generateurDeGrilleService: GenerateurDeGrilleService) {
        this.generateurDeGrilleService = generateurDeGrilleService;
    }

    public creerPartie(joueur: Joueur, typePartie: TypePartie, niveau: Niveau, joueur2?: Joueur ): string {
        const grilles: Grille[] = new Array();
        const joueurs = new Array(LIMITE_JOUEURS);

        switch(typePartie) {

            case TypePartie.classique:
                grilles.push(this.generateurDeGrilleService.genererGrille(niveau));
            break;

            case TypePartie.dynamique:
                for (let i = 0; i < NOMBRE_GRILLES_PARTIE_DYNAMIQUE; i++) {
                    grilles.push(this.generateurDeGrilleService.genererGrille(niveau));
                }
            break;
        }

        const partie: Partie = new Partie(grilles, joueurs, typePartie);
        this.parties.push(partie);

        return partie.obtenirPartieGuid();
    }

    public obtenirPartieEnCours(guidPartie: string): Partie {
        for (let partie of this.parties) {
            if (partie.obtenirPartieGuid() === guidPartie) {
                return partie;
            }
        }

        throw new Error(AUCUNE_PARTIE_CORREPSONDANT_GUID);
    }




}