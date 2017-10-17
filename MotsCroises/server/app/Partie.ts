import { Joueur } from '../../commun/Joueur';
import { Grille } from './Grille';
import { Case } from '../../commun/Case';
import { Guid } from '../../commun/Guid';
import { TypePartie } from '../../commun/TypePartie';
export const LIMITE_JOUEURS = 2;

export class Partie {
    private joueurs: Joueur[] = new Array();
    private grille: Grille;
    private type: TypePartie = TypePartie.classique;
    private guid: string = Guid.generateGUID();

    constructor(grille: Grille, joueurs: Joueur[], type: TypePartie) {
        this.grille = grille;

        this.joueurs = joueurs;

        this.type = type;
    }

    public estLeMot(caseDebut: Case, caseFin: Case, motAVerifier: string, guidJoueur: string): boolean {
        let joueur: Joueur;

       if (this.grille.verifierMot(motAVerifier, caseDebut, caseFin)) {
            joueur = this.obtenirJoueur(guidJoueur);
            joueur.aTrouveMot();

            return true;
       }

       return false;
    }

    private obtenirJoueur(guidJoueur: string): Joueur {
        for (const joueur of this.joueurs) {
            if (joueur.obtenirGuid() === guidJoueur) {
                return joueur;
            }
        }

        return undefined;
    }

    public obtenirPartieGuid(): string {
        return this.guid;
    }

    public ajouterJoueur(joueur: Joueur): void {
        if (this.joueurs.length <= LIMITE_JOUEURS) {
            this.joueurs.push(joueur);
        }
    }

    public partieEstTermine(): boolean {
        let totalPointage = 0;

        for (const joueur of this.joueurs) {
            totalPointage += joueur.obtenirPointage();
        }

        if (totalPointage >= this.grille.obtenirEmplacementsMot().length) {
            return true;
        }

        return false;
    }
}
