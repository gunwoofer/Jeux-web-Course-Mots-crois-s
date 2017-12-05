import { EmplacementMot } from '../emplacementMot';
import { Case } from '../case';

export class RequisPourMotAVerifier {
    public emplacementMot: EmplacementMot;
    public motAVerifier: string;
    public guidJoueur: string;
    public guidPartie: string;
    public estLeMot: boolean = false;
    
    
    public static rehydrater(source: any): RequisPourMotAVerifier {
        let sourceRequisPourMotAVerifier = source as RequisPourMotAVerifier;
        let vraiRequisPourMotAVerifier = new RequisPourMotAVerifier(sourceRequisPourMotAVerifier.emplacementMot, sourceRequisPourMotAVerifier.motAVerifier, sourceRequisPourMotAVerifier.guidJoueur, sourceRequisPourMotAVerifier.guidPartie);

        Object.assign(vraiRequisPourMotAVerifier, sourceRequisPourMotAVerifier);

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

        vraiRequisPourMotAVerifier.emplacementMot = vraieEmplacementMot;

        return vraiRequisPourMotAVerifier

    }

    constructor (emplacementMot: EmplacementMot, motAVerifier: string, guidJoueur: string, guidPartie: string) {
        this.emplacementMot = emplacementMot;
        this.motAVerifier = motAVerifier;
        this.guidJoueur = guidJoueur;
        this.guidPartie = guidPartie;
    }

    public validerMot() {
        this.estLeMot = true;
    }
}