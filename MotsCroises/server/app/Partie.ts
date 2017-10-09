import { Joueur } from './Joueur';
import { Compteur } from './Compteur';
import { Grille } from './Grille';
import { Case } from './Case';
import { Guid } from './Guid';
import { NOMBRE_GRILLES_PARTIE_DYNAMIQUE } from './GestionnaireDePartieService';
export const LIMITE_JOUEURS = 2;

export enum EtatPartie {
    En_Preparation,
    En_Cours,
    Termine
}

export enum TypePartie {
    classique,
    dynamique
}

export class Partie {
    private joueurs: Joueur[] = new Array();
    private grille: Grille;
    private compteur: Compteur;
    private etat: EtatPartie = EtatPartie.En_Preparation;
    private type: TypePartie = TypePartie.classique;
    private guid: string = Guid.generateGUID();

    constructor(grille: Grille, joueurs: Joueur[], type: TypePartie) {
        this.grille = grille;

        this.joueurs = joueurs;

        this.type = type;
    }

    public estLeMot(caseDebut: Case, caseFin: Case, motAVerifier: string, guidJoueur: string): boolean {
        let joueur: Joueur;

       if(this.grille.verifierMot(motAVerifier, caseDebut, caseFin)) {
            joueur = this.obtenirJoueur(guidJoueur);
            joueur.aTrouveMot(this.grille.obtenirEmplacementMot(caseDebut, caseFin));

            return true;
       }

       return false;
    }

    private obtenirJoueur(guidJoueur: string): Joueur {
        for(let joueur of this.joueurs) {
            if(joueur.obtenirGuid() === guidJoueur) {
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

        for(let joueur of this.joueurs) {
            totalPointage += joueur.obtenirPointage();
        }

        if(totalPointage >= this.grille.obtenirEmplacementsMot().length) {
            return true;
        }

        return false;
    }
}