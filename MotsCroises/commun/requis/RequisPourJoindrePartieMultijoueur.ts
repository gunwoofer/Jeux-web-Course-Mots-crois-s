import { Joueur } from "../Joueur";
import { SpecificationPartie } from "../SpecificationPartie";



export class RequisPourJoindrePartieMultijoueur {
    // A completer
    public guidPartie: string;
    public joueurAAjouter: Joueur;

    // Retour serveur
    public joueurs: Joueur[];
    public specificationPartie: SpecificationPartie;
    
    public static rehydrater(source: RequisPourJoindrePartieMultijoueur): RequisPourJoindrePartieMultijoueur {
        let sourceVraie = source as RequisPourJoindrePartieMultijoueur;
        let joueur: Joueur;
        let joueurs: Joueur[] = new Array();

        for(let joueurCourant of sourceVraie.joueurs) {
            joueur = new Joueur();
            Object.assign(joueur, joueurCourant);
            joueurs.push(joueur);
        }

        joueur = new Joueur();
        Object.assign(joueur, sourceVraie.joueurAAjouter);
        sourceVraie.joueurAAjouter = joueur;

        sourceVraie.specificationPartie = SpecificationPartie.rehydrater(sourceVraie.specificationPartie);

        let cibleVraie = new RequisPourJoindrePartieMultijoueur(sourceVraie.guidPartie, sourceVraie.joueurAAjouter);
        Object.assign(cibleVraie, sourceVraie);
        cibleVraie.joueurs = joueurs;
        
        return cibleVraie;
    }

    constructor(guidPartie: string, jouerAAjouter: Joueur) {
        this.guidPartie = guidPartie;
        this.joueurAAjouter = jouerAAjouter;
    }

}