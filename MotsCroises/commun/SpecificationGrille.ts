import { EmplacementMot } from './EmplacementMot';
import { Cases } from './Cases';

export class SpecificationGrille {
    public cases: Cases;
    public emplacementMots: EmplacementMot[];

    constructor( cases: Cases, emplacementMots: EmplacementMot[]) {
        this.cases = cases;
        this.emplacementMots = emplacementMots;
    }
} 