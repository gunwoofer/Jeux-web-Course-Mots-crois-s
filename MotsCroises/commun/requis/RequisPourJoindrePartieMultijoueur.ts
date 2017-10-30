import { Joueur } from "../Joueur";
import { SpecificationPartie } from "../SpecificationPartie";



export class RequisPourJoindrePartieMultijoueur {
    // A completer
    public guidPartie: string;
    public joueurAAjouter: Joueur;

    // Retour serveur
    public joueurs: Joueur[];
    public specificationPartie: SpecificationPartie;

}