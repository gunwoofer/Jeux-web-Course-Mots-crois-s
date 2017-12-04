import { Indice } from './../server/app/indice';

import { Niveau } from './niveau';
import { Joueur } from './joueur';
import { TypePartie } from './typePartie';
import { EtatPartie } from './etatPartie';
import { SpecificationGrille } from './specificationGrille';

export class SpecificationPartie {
    public niveau: Niveau;
    public joueur: Joueur;
    public typePartie: TypePartie;
    public etatPartie: EtatPartie = EtatPartie.En_Preparation;
    public guidPartie: string;
    public specificationGrilleEnCours: SpecificationGrille;
    public indices: Indice[];

    public static rehydrater(source: SpecificationPartie): SpecificationPartie {
        let sourceVraie = source as SpecificationPartie;
        let joueur: Joueur = new Joueur();
        
        Object.assign(joueur, sourceVraie.joueur);
        sourceVraie.joueur = joueur;
        if (sourceVraie.specificationGrilleEnCours !== undefined) {
            sourceVraie.specificationGrilleEnCours = SpecificationGrille.rehydrater(sourceVraie.specificationGrilleEnCours);
        }
        let cibleVraie = new SpecificationPartie(sourceVraie.niveau, joueur, sourceVraie.typePartie);
        Object.assign(cibleVraie, sourceVraie);

        return cibleVraie;
    }
    
    constructor(niveau: Niveau, joueur: Joueur, typePartie: TypePartie) {
        this.niveau = niveau;
        this.joueur = joueur;
        this.typePartie = typePartie;
        this.indices = new Array();
    }
}