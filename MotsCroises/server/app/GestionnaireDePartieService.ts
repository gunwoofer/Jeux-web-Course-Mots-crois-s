import { Partie, TypePartie, LIMITE_JOUEURS } from './Partie';
import { Grille, Niveau } from './Grille';
import { Guid } from './Guid';
import { Case } from './Case';

import { Joueur } from './Joueur';

export const NOMBRE_GRILLES_PARTIE_DYNAMIQUE = 5;
export const AUCUNE_PARTIE_CORREPSONDANT_GUID = 'Aucune partie correspondant au GUID n\'a été trouvé';

export class GestionnaireDePartieService {
    private parties: Partie[] = new Array();

    public creerPartie(joueur: Joueur, typePartie: TypePartie, grilleDepart: Grille, niveau: Niveau, joueur2?: Joueur ): string {
        const joueurs = new Array(LIMITE_JOUEURS);

        const partie: Partie = new Partie(grilleDepart, joueurs, typePartie);
        this.parties.push(partie);

        return partie.obtenirPartieGuid();
    }

    public estLeMot(caseDebut: Case, caseFin: Case, motAVerifier: string, guidPartie: string, guidJoueur: string): boolean {
        const partieAVerifier: Partie = this.obtenirPartieEnCours(guidPartie);

        if(partieAVerifier.estLeMot(caseDebut, caseFin, motAVerifier, guidJoueur)) {
            return true;
        }

        return false;
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