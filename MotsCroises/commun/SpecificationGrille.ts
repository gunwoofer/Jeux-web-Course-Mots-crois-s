import { EmplacementMot } from './EmplacementMot';
import { Cases } from './Cases';

export class SpecificationGrille {
    public cases: Cases;
    public emplacementMots: EmplacementMot[];

    constructor( cases: Cases, emplacementMots: EmplacementMot[]) {
        this.cases = cases;
        this.emplacementMots = emplacementMots;
    }

    public obtenirEmplacementMot(guidIndice: string): EmplacementMot {
        for(let emplacementCourant of this.emplacementMots) {
            if(emplacementCourant.obtenirGuidIndice() === guidIndice)
                return emplacementCourant;
        }

        return undefined;
    }
} 