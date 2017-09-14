import { Case } from './Case'

export class EmplacementMot {
    private caseDebut:Case;
    private caseFin:Case;
    private grandeur:number;

    constructor(caseDebut:Case, caseFin:Case) {
        this.caseDebut = caseDebut;
        this.caseFin = caseFin;
        
        if(caseDebut.getX() === caseFin.getX()) {
            this.grandeur = caseFin.getY() - caseDebut.getY();
        }
        else if (caseDebut.getY() === caseFin.getY()) {
            this.grandeur = caseFin.getX() - caseDebut.getX();
        }

    }

    public obtenirCaseDebut():Case {
        return this.caseDebut;
    }

    public obtenirCaseFin():Case {
        return this.caseFin;
    }

    public obtenirGrandeur():number {
        return this.grandeur;
    }
}