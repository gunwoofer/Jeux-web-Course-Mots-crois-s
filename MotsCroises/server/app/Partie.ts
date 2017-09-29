import { Joueur } from './Joueur';
import { Compteur } from './Compteur';
import { Grille } from './Grille';
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
    private joureurs: Joueur[] = new Array(LIMITE_JOUEURS);
    private grilles: Grille[] = new Array(NOMBRE_GRILLES_PARTIE_DYNAMIQUE);
    private compteur: Compteur;
    private etat: EtatPartie = EtatPartie.En_Preparation;
    private type: TypePartie = TypePartie.classique;
    private guid: string = Guid.generateGUID();

    constructor(grilles: Grille[], joueurs: Joueur[], type: TypePartie) {
        this.grilles.concat(grilles);

        if (joueurs.length <= 2) {
            this.joureurs.concat(joueurs);
        }

        this.type = type;
    }

    public obtenirPartieGuid(): string {
        return this.guid;
    }

    public ajouterJoueur(joueur: Joueur): void {
        if (this.joureurs.length <= LIMITE_JOUEURS) {
            this.joureurs.push(joueur);
        }
    }



}
