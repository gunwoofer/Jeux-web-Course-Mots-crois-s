import { Grille } from './Grille';
import { Niveau } from '../../commun/Niveau';
import { MotComplet, Rarete } from './MotComplet';
import { Case } from '../../commun/Case';
import { Indice, DifficulteDefinition } from './Indice';
import { GenerateurDeGrilleVide } from './GenerateurDeGrilleVide';
import * as grilleConstantes from './GrilleConstants';

export const NOMBRE_DE_GRILLE = 5;

const INDICE_MOCK = new Indice(['definition facile', 'definition un peu difficile', 'definition dure de ouuuuf']);

export class GenerateurDeGrilleService {
    protected motCroiseGenere: Grille;
    private generateurDeGrilleVide: GenerateurDeGrilleVide = new GenerateurDeGrilleVide();

    public genererGrille(niveau: Niveau): Grille {
        this.motCroiseGenere = this.genereGrilleVide(niveau);
        this.motCroiseGenere = this.remplirGrille(niveau);

        return this.motCroiseGenere;
    }

    public obtenirGrillesBase(): Grille[] {
        const grillesFacileObtenue: Grille[] = this.obtenirGrilles(Niveau.facile);
        const grillesMoyenObtenue: Grille[] = this.obtenirGrilles(Niveau.moyen);
        const grillesDifficileObtenue: Grille[] = this.obtenirGrilles(Niveau.difficile);

        return grillesFacileObtenue.concat(grillesMoyenObtenue).concat(grillesDifficileObtenue);
    }

    private obtenirGrilles(niveau: Niveau): Grille[] {
        const grilles: Grille[] = new Array();
        for (let i = 0; i < NOMBRE_DE_GRILLE; i++) {
            grilles.push(this.genererGrille(niveau));
        }
        return grilles;
    }

    public genereGrilleVide(niveau: Niveau): Grille {
        let grilleVide = new Grille(niveau);

        // Pour chaque ligne & colonne, on créer un nombre équivaut aux nombre de mots.
        const nombreMotsParLigne: number[] = this.generateurDeGrilleVide.obtenirNombreMots();
        const nombreMotsParColonne: number[] = this.generateurDeGrilleVide.obtenirNombreMots();

        // Pour chaque mot de lignes & colonnes, on créer un nombre équivaut à la longueur du mot.
        const grandeurMotsParLigne: number[][] = this.generateurDeGrilleVide.obtenirGrandeurMots(nombreMotsParLigne);
        const grandeurMotsParColonne: number[][] = this.generateurDeGrilleVide.obtenirGrandeurMots(nombreMotsParColonne);

        // Pour chaque mot de lignes & colonnes, positionnez-le pour que celui-ci est le moins d'intersection possible.
        grilleVide = this.generateurDeGrilleVide.positionnerCases(grilleVide, grandeurMotsParLigne, grandeurMotsParColonne);

        grilleVide.genererEmplacementsMot();

        return grilleVide;
    }

    private remplirGrille(niveau: Niveau): Grille {
        const grillePlein = this.motCroiseGenere;
        let motAjoute: boolean;
        let caseDebut: Case;
        let caseFin: Case;


        while (!this.estComplete(grillePlein)) {
            for (const emplacementMotCourant of grillePlein.obtenirEmplacementsMot()) {
                motAjoute = false;

                while (!motAjoute) {
                    const grandeur = emplacementMotCourant.obtenirGrandeur();
                    let chaineIdiote = '';

                    for (let i = 0; i < grandeur; i++) {
                        chaineIdiote = chaineIdiote + grilleConstantes.lettresDeAlphabet.charAt(
                            this.nombreAleatoireEntreXEtY(1, grilleConstantes.nombreLettresDeAlphabet));
                    }

                    let motIdiot: MotComplet = new MotComplet(chaineIdiote, INDICE_MOCK);

                    motIdiot = this.mettreAJourNiveauMot(motIdiot, (niveau !== Niveau.difficile) ? Rarete.commun : Rarete.nonCommun,
                                                        (niveau !== Niveau.facile) ? DifficulteDefinition.DefinitionAlternative :
                                                        DifficulteDefinition.PremiereDefinition);

                    if (!grillePlein.motsComplet.contientDejaLeMot(motIdiot)) {
                        caseDebut = emplacementMotCourant.obtenirCaseDebut();
                        caseFin = emplacementMotCourant.obtenirCaseFin();

                        grillePlein.ajouterMot(motIdiot, caseDebut.obtenirNumeroLigne(),
                                caseDebut.obtenirNumeroColonne(), caseFin.obtenirNumeroLigne(), caseFin.obtenirNumeroColonne());

                        motAjoute = true;
                    }
                }
            }
        }

        return grillePlein;
    }

    private estComplete(grille: Grille): boolean {
        for (let i = 0; i < 10; i++) {
            if (grille.obtenirNombreMotsSurLigne(i) < 1 || grille.obtenirNombreMotsSurColonne(i) < 1) {
                return false;
            }
        }

        return true;
    }

    private mettreAJourNiveauMot(motIdiot: MotComplet, rarete: number, difficulteDesDefinitions: number): MotComplet {
        motIdiot.setRarete(rarete);
        motIdiot.obtenirIndice().setDifficulteDefinition(difficulteDesDefinitions);

        return motIdiot;
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
