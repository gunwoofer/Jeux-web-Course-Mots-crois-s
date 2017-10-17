import { Partie } from './Partie';
import { Grille } from './Grille';
import { Case } from '../../commun/Case';
import { Niveau } from '../../commun/Niveau';
import { TypePartie } from '../../commun/TypePartie';
import { Joueur } from '../../commun/Joueur';

export const NOMBRE_GRILLES_PARTIE_DYNAMIQUE = 5;
export const AUCUNE_PARTIE_CORREPSONDANT_GUID = 'Aucune partie correspondant au GUID n\'a été trouvé';

export class GestionnaireDePartieService {
    private parties: Partie[] = new Array();

    public creerPartie(joueur: Joueur, typePartie: TypePartie, grilleDepart: Grille, niveau: Niveau, joueur2?: Joueur ): string {
        const joueurs: Joueur[] = [joueur];

        if(joueur2 !== undefined) {
            joueurs.push(joueur2);
        }

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
        for (const partie of this.parties) {
            if (partie.obtenirPartieGuid() === guidPartie) {
                return partie;
            }
        }

        throw new Error(AUCUNE_PARTIE_CORREPSONDANT_GUID);
    }

    public voirSiPartieTermine(guidPartie: string): boolean {
        if(this.obtenirPartieEnCours(guidPartie).partieEstTermine()) {
            return true;
        }
        return false;
    }
}
