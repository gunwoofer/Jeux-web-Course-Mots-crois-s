import { EtatCase } from './../../commun/Case';
import { Grille } from './Grille';
import { Niveau } from '../../commun/Niveau';
import { MotComplet, Rarete } from './MotComplet';
import { Case } from '../../commun/Case';
import { Indice, DifficulteDefinition } from './Indice';
import { GenerateurDeGrilleVide } from './GenerateurDeGrilleVide';
import * as grilleConstantes from '../../commun/constantes/GrilleConstantes';
import { GenerateurDeMotContrainteService } from './GenerateurDeMotContrainteService';

export const NOMBRE_DE_GRILLE = 5;

const INDICE_MOCK = new Indice(['definition facile', 'definition un peu difficile', 'definition dure de ouuuuf']);

export class GenerateurDeGrilleService {
    protected motCroiseGenere: Grille;
    private generateurDeGrilleVide: GenerateurDeGrilleVide = new GenerateurDeGrilleVide();

    public genererGrille(niveau: Niveau): Grille {
        this.motCroiseGenere = this.generateurDeGrilleVide.genereGrilleVide(niveau);
        // this.motCroiseGenere = this.remplirGrille(niveau, this.motCroiseGenere);
        this.remplirGrille(niveau, this.motCroiseGenere).then((grilleRemplie) => {
            this.motCroiseGenere = grilleRemplie;
            this.affichageConsole(this.motCroiseGenere);
        });

        return this.motCroiseGenere;
    }

    public affichageConsole(grille: Grille): void {
        for (let i = 0; i < 10; i++) {
            let ligne: string;
            ligne = '';
            for (let j = 0; j < 10; j++) {
                const caseGrille: Case = grille.cases.obtenirCase(i, j);
                if (caseGrille.etat === EtatCase.noir) {
                    ligne += '#';
                } else {
                    ligne += '.';
                }
            }
            console.log(ligne);
        }
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

    private async remplirGrille(niveau: Niveau, grille: Grille): Promise<Grille> {
        // Premier mot seulement
        const emplacementMot = grille.obtenirEmplacementsMot()[0];
        const tailleMot = emplacementMot.obtenirGrandeur();
        const generateurMot = new GenerateurDeMotContrainteService(tailleMot);
        generateurMot.genererMotAleatoire(tailleMot).then((mot) => {
            const caseDebut = emplacementMot.obtenirCaseDebut();
            const caseFin = emplacementMot.obtenirCaseFin();
            grille.ajouterMotEmplacement(mot, emplacementMot);
        });

        return grille;
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
