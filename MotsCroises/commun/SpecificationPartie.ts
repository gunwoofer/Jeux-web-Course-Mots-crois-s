import { Niveau } from './Niveau';
import { Joueur } from './Joueur';
import { TypePartie } from './TypePartie';
import { EtatPartie } from './EtatPartie';
import { SpecificationGrille } from './SpecificationGrille';

export class SpecificationPartie {
    public niveau: Niveau;
    public joueur: Joueur;
    public typePartie: TypePartie;
    public etatPartie: EtatPartie = EtatPartie.En_Preparation;
    public guidPartie: string;
    public specificationGrilleEnCours: SpecificationGrille;

    constructor(niveau: Niveau, joueur: Joueur, typePartie: TypePartie) {
        this.niveau = niveau;
        this.joueur = joueur;
        this.typePartie = typePartie;
    }
}