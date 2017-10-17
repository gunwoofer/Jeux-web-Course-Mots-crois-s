import { EmplacementMot } from './EmplacementMot';
import { Cases } from './Cases';
import { Case } from './Case';
import {Indice} from "../server/app/Indice";

export class SpecificationGrille {
    public cases: Cases;
    public emplacementMots: EmplacementMot[];

    public static rehydrater(source: any): SpecificationGrille {
        let vraiSourceSpecificationGrille = source as SpecificationGrille;
        let vraiSpecificationGrille : SpecificationGrille = new SpecificationGrille(vraiSourceSpecificationGrille.cases, vraiSourceSpecificationGrille.emplacementMots);
        

        let vraiEmplacementsMot: EmplacementMot[] = this.rehydraterEmplacementMots(vraiSpecificationGrille);
        let vraiCases: Cases = this.rehydraterCases(vraiSpecificationGrille);
        Object.assign(vraiSpecificationGrille, vraiSourceSpecificationGrille);

        vraiSpecificationGrille.emplacementMots = vraiEmplacementsMot;
        vraiSpecificationGrille.cases = vraiCases;

        return vraiSpecificationGrille;
    }
    
    private static rehydraterEmplacementMots(jsonEnGrille: SpecificationGrille): EmplacementMot[] {
        let vraiEmplacementsMot: EmplacementMot[] = new Array();
        let vraieEmplacementMot: EmplacementMot;
        let vraieCaseDebut: Case;
        let vraieCaseFin: Case;
        let emplacementMotCourant: any;
        for (let i = 0; i < jsonEnGrille.emplacementMots.length; i++) {
            emplacementMotCourant = jsonEnGrille.emplacementMots[i];
            vraieCaseDebut = new Case(emplacementMotCourant.caseDebut.numeroLigne,
                emplacementMotCourant.caseDebut.numeroColonne, emplacementMotCourant.caseDebut.etat);
            vraieCaseFin = new Case(emplacementMotCourant.caseFin.numeroLigne,
                emplacementMotCourant.caseFin.numeroColonne, emplacementMotCourant.caseFin.etat);

            // Permet de surpasser l'encapsulation de l'objet (incomplet) EmplacementMot.
            const emplacementMotIncomplet: any = jsonEnGrille.emplacementMots[i];

            Object.assign(vraieCaseDebut, emplacementMotIncomplet.caseDebut as Case);
            Object.assign(vraieCaseFin, emplacementMotIncomplet.caseFin as Case);

            vraieEmplacementMot = new EmplacementMot(vraieCaseDebut, vraieCaseFin);

            Object.assign(vraieEmplacementMot, emplacementMotCourant as EmplacementMot);

            vraieEmplacementMot.modifierCaseDebutFin(vraieCaseDebut, vraieCaseFin);


            vraiEmplacementsMot.push(vraieEmplacementMot);
        }

        return vraiEmplacementsMot;
    }
    
    private static rehydraterCases(jsonEnGrille: any): Cases {
        let cases: Cases = new Cases();
        let vraieCase: Case;

        for (let i = 0; i < jsonEnGrille.cases.cases.length; i++) {
            for (let j = 0; j < jsonEnGrille.cases.cases[i].length; j++) {
                vraieCase = new Case(jsonEnGrille.cases.cases[i][j].numeroLigne,
                    jsonEnGrille.cases.cases[i][j].numeroColonne, jsonEnGrille.cases.cases[i][j].etat);
                Object.assign(vraieCase, jsonEnGrille.cases.cases[i][j] as Case);

                cases.ajouterCase(vraieCase, vraieCase.obtenirNumeroLigne(), vraieCase.obtenirNumeroColonne());

            }
        }

        return cases;
    }

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