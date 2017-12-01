import { RequisPourMotAVerifier } from './../../commun/requis/RequisPourMotAVerifier';
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

        if (joueur2 !== undefined) {
            joueurs.push(joueur2);
        }

        const partie: Partie = new Partie(grilleDepart, joueurs, typePartie);
        this.parties.push(partie);

        return partie.obtenirPartieGuid();
    }

    public obtenirPartiesEnAttente(): Partie[] {
        const partiesEnCours: Partie[] = [];

        for (const partieCourante of this.parties) {
            if (!partieCourante.estDebute()) {
                partiesEnCours.push(partieCourante);
            }
        }

        return partiesEnCours;
    }

    public estLeMot(requisPourMotAVerifier: RequisPourMotAVerifier): boolean {
        if (this.obtenirPartieEnCours(requisPourMotAVerifier.guidPartie).estLeMot(requisPourMotAVerifier)) {
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
        const partieEnCours: Partie = this.obtenirPartieEnCours(guidPartie);

        if (partieEnCours.estMultijoueur() && partieEnCours.partieEstTermineAvecCompteur()) {
            return true;
        }

        if (partieEnCours.partieEstTermine()) {
            return true;
        }

        return false;
    }
}
