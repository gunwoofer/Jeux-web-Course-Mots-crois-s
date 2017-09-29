import { Grille } from './Grille';
import { Joueur } from './Joueur';
import { Compteur } from './Compteur';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
export const LIMITE_JOUEURS = 2;

enum EtatPartie {
    En_Preparation,
    En_Cours,
    Termine
}

export class Partie {
    private joureurs: Joueur[] = new Array(LIMITE_JOUEURS);
    private grilles: Grille[];
    private compteur: Compteur;
    private generateurDeGrilleService: GenerateurDeGrilleService;
    private etat: EtatPartie = EtatPartie.En_Preparation;

    constructor(generateurDeGrilleService: GenerateurDeGrilleService) {
    }

    public ajouterJoueur(joueur: Joueur): void {
        if(this.joureurs.length <= LIMITE_JOUEURS) {
            this.joureurs.push(joueur);
        }
    }



}