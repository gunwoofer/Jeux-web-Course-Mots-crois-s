import { EmplacementMot } from '../EmplacementMot';
import { Case } from '../Case';

export class RequisPourSelectionnerMot {
    public guidPartie: string;
    public guidJoueur: string;
    public emplacementMot: EmplacementMot;
    
    
    public static rehydrater(source: any): RequisPourSelectionnerMot {
        let sourceRequisPourSelectionnerMot = source as RequisPourSelectionnerMot;
        let vraiRequisPourSelectionnerMot = new RequisPourSelectionnerMot(sourceRequisPourSelectionnerMot.emplacementMot, 
            sourceRequisPourSelectionnerMot.guidJoueur, sourceRequisPourSelectionnerMot.guidPartie);

        Object.assign(vraiRequisPourSelectionnerMot, sourceRequisPourSelectionnerMot);

        let vraieEmplacementMot: EmplacementMot;
        let vraieCaseDebut: Case;
        let vraieCaseFin: Case;
        let emplacementMotCourant = source.emplacementMot;

        vraieCaseDebut = new Case(emplacementMotCourant.caseDebut.numeroLigne,
            emplacementMotCourant.caseDebut.numeroColonne, emplacementMotCourant.caseDebut.etat);
        vraieCaseFin = new Case(emplacementMotCourant.caseFin.numeroLigne,
            emplacementMotCourant.caseFin.numeroColonne, emplacementMotCourant.caseFin.etat);

        vraieEmplacementMot = new EmplacementMot(vraieCaseDebut, vraieCaseFin);

        Object.assign(vraieEmplacementMot, emplacementMotCourant as EmplacementMot);

        vraieEmplacementMot.modifierCaseDebutFin(vraieCaseDebut, vraieCaseFin);

        vraiRequisPourSelectionnerMot.emplacementMot = vraieEmplacementMot;

        return vraiRequisPourSelectionnerMot;
    }
    
    constructor (emplacementMot: EmplacementMot, guidJoueur: string, guidPartie: string) {
        this.emplacementMot = emplacementMot;
        this.guidJoueur = guidJoueur;
        this.guidPartie = guidPartie;
    }
}