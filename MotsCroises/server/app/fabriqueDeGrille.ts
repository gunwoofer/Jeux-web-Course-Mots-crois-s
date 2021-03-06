import { MotComplet } from './motComplet';
import { Case } from '../../commun/case';
import { EmplacementMot } from '../../commun/emplacementMot';
import { Cases } from '../../commun/cases';
import { Niveau } from '../../commun/niveau';
import { Grille } from './grille';

export class FabriqueDeGrille {
    public static creerInstanceAvecJSON(jsonGrille: string): Grille {
        const jsonEnGrille = (JSON.parse(jsonGrille) as Grille);
        const vraieGrille: Grille = new Grille(Niveau.facile);
        Object.assign(new Grille(Niveau.facile), jsonEnGrille);
        vraieGrille.cases = this.creerInstanceAvecJSONCases(jsonEnGrille);
        vraieGrille.modifierEmplacementsMot(this.creerInstanceAvecJSONEmplacementMots(jsonEnGrille));
        vraieGrille.mots = this.creerInstanceAvecJSONMotComplet(jsonEnGrille);
        return vraieGrille;
    }

    private static creerInstanceAvecJSONMotComplet(jsonEnGrille: Grille): MotComplet[] {
        const vraiMotsComplet: MotComplet[] = new Array();
        for (const motCompletCourant of jsonEnGrille.mots) {
            // Permet de surpasser l'encapsulation de l'objet incomplet MotComplet.
            const motCompletIncomplet: any = motCompletCourant;
            const vraiMotComplet = new MotComplet('', motCompletIncomplet.indice);
            Object.assign(vraiMotComplet, motCompletCourant);
            vraiMotsComplet.push(vraiMotComplet);
        }
        return vraiMotsComplet;
    }

    private static creerInstanceAvecJSONEmplacementMots(jsonEnGrille: Grille): EmplacementMot[] {
        const vraiEmplacementsMot: EmplacementMot[] = new Array();
        let emplacementMotCourant: any;
        for (let i = 0; i < jsonEnGrille.emplacementMots.length; i++) {
            emplacementMotCourant = jsonEnGrille.emplacementMots[i];
            const vraieCaseDebut = new Case(emplacementMotCourant.caseDebut.numeroLigne,
                emplacementMotCourant.caseDebut.numeroColonne, emplacementMotCourant.caseDebut.etat);
            const vraieCaseFin = new Case(emplacementMotCourant.caseFin.numeroLigne,
                emplacementMotCourant.caseFin.numeroColonne, emplacementMotCourant.caseFin.etat);
            // Permet de surpasser l'encapsulation de l'objet incomplet EmplacementMot.
            const emplacementMotIncomplet: any = jsonEnGrille.emplacementMots[i];
            Object.assign(vraieCaseDebut, emplacementMotIncomplet.caseDebut as Case);
            Object.assign(vraieCaseFin, emplacementMotIncomplet.caseFin as Case);
            const vraieEmplacementMot = new EmplacementMot(vraieCaseDebut, vraieCaseFin);
            Object.assign(vraieEmplacementMot, emplacementMotCourant as EmplacementMot);
            vraieEmplacementMot.modifierCaseDebutFin(vraieCaseDebut, vraieCaseFin);
            vraiEmplacementsMot.push(vraieEmplacementMot);
        }
        return vraiEmplacementsMot;
    }

    private static creerInstanceAvecJSONCases(jsonEnGrille: any): Cases {
        const cases: Cases = new Cases();
        for (let i = 0; i < jsonEnGrille.cases.cases.length; i++) {
            for (let j = 0; j < jsonEnGrille.cases.cases[i].length; j++) {
                const vraieCase = new Case(jsonEnGrille.cases.cases[i][j].numeroLigne,
                    jsonEnGrille.cases.cases[i][j].numeroColonne, jsonEnGrille.cases.cases[i][j].etat);
                Object.assign(vraieCase, jsonEnGrille.cases.cases[i][j] as Case);

                cases.ajouterCase(vraieCase, vraieCase.obtenirNumeroLigne(), vraieCase.obtenirNumeroColonne());
            }
        }
        return cases;
    }
}
