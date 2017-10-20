import { MotComplet } from './MotComplet';
import { Case } from '../../commun/Case';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { Cases } from '../../commun/Cases';
import { Niveau } from '../../commun/Niveau';
import { Grille } from './Grille';

export class FabriqueDeGrille {
    public static creerInstanceAvecJSON(jsonGrille: string): Grille {
        const jsonEnGrille = (JSON.parse(jsonGrille) as Grille);

        const vraieGrille: Grille = new Grille(Niveau.facile);

        Object.assign(vraieGrille, jsonEnGrille);

        const vraiEmplacementsMot: EmplacementMot[] = this.creerInstanceAvecJSONEmplacementMots(jsonEnGrille);
        const vraiCases: Cases = this.creerInstanceAvecJSONCases(jsonEnGrille);
        const vraiMotsComplet: MotComplet[] = this.creerInstanceAvecJSONMotComplet(jsonEnGrille);

        vraieGrille.cases = vraiCases;
        vraieGrille.modifierEmplacementsMot(vraiEmplacementsMot);
        vraieGrille.mots = vraiMotsComplet;


        return vraieGrille;
    }


    private static creerInstanceAvecJSONMotComplet(jsonEnGrille: Grille): MotComplet[] {
        const vraiMotsComplet: MotComplet[] = new Array();
        let vraiMotComplet: MotComplet;

        for (const motCompletCourant of jsonEnGrille.mots) {
            // Permet de surpasser l'encapsulation de l'objet (incomplet) MotComplet.
            const motCompletIncomplet: any = motCompletCourant;

            vraiMotComplet = new MotComplet(motCompletCourant.lettres, motCompletIncomplet.indice);
            Object.assign(vraiMotComplet, motCompletCourant);
            vraiMotsComplet.push(vraiMotComplet);
        }

        return vraiMotsComplet;
    }

    private static creerInstanceAvecJSONEmplacementMots(jsonEnGrille: Grille): EmplacementMot[] {
        const vraiEmplacementsMot: EmplacementMot[] = new Array();
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

    private static creerInstanceAvecJSONCases(jsonEnGrille: any): Cases {
        const cases: Cases = new Cases();
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
}