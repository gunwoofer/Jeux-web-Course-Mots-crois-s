import { Case } from './Case'

export class EmplacementMot {
    private caseDebut:Case;
    private caseFin:Case;

    constructor(caseDebut:Case, caseFin:Case) {
        this.caseDebut = caseDebut;
        this.caseFin = caseFin;
    }

    public obtenirCaseDebut():Case {
        return this.caseDebut;
    }

    public obtenirCaseFin():Case {
        return this.caseFin;
    }
}