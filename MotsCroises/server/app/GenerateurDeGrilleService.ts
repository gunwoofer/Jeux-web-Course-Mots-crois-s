import { EmplacementMot } from './../../commun/EmplacementMot';
import { Contrainte } from './Contrainte';
import { EtatCase } from './../../commun/Case';
import { Grille } from './Grille';
import { Niveau } from '../../commun/Niveau';
import { MotComplet, Rarete } from './MotComplet';
import { Case } from '../../commun/Case';
import { Indice, DifficulteDefinition } from './Indice';
import { GenerateurDeGrilleVide } from './GenerateurDeGrilleVide';
import * as grilleConstantes from '../../commun/constantes/GrilleConstantes';
import { GenerateurDeMotContrainteService } from './GenerateurDeMotContrainteService';
import { Position } from '../../commun/Position';

export const NOMBRE_DE_GRILLE = 5;

export class GenerateurDeGrilleService {
    protected motCroiseGenere: Grille;
    private generateurDeGrilleVide: GenerateurDeGrilleVide = new GenerateurDeGrilleVide();

    public genererGrille(niveau: Niveau): Grille {
        this.motCroiseGenere = this.generateurDeGrilleVide.genereGrilleVide(niveau);
        this.remplirGrille(niveau, this.motCroiseGenere).then((grilleRemplie) => {
            this.motCroiseGenere = grilleRemplie;
            this.affichageConsole(this.motCroiseGenere);
        });
        return this.motCroiseGenere;
    }

    public affichageConsole(grille: Grille): void {
        let nombrePleine = 0;
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
                if (caseGrille.etat === EtatCase.pleine) {
                    nombrePleine++;
                }
            }
            console.log(ligne);
        }
        console.log('------------------------------------------');
        console.log('Nombre de cases pleines = ', nombrePleine);
        console.log('------------------------------------------');
        for (let i = 0; i < 10; i++) {
            let ligne: string;
            ligne = '';
            for (let j = 0; j < 10; j++) {
                const caseGrille: Case = grille.cases.obtenirCase(i, j);
                if (caseGrille.obtenirLettre() === '') {
                    ligne += '#';
                } else {
                    ligne += caseGrille.obtenirLettre();
                }
            }
            console.log(ligne);
        }
    }

    private genererTableauContraintes(grille: Grille, emplacement: EmplacementMot): Contrainte[] {
        const tableauContraintes: Contrainte[] = new Array();
        const ligneDepart: number = emplacement.obtenirCaseDebut().obtenirNumeroLigne();
        const colonneDepart: number = emplacement.obtenirCaseDebut().obtenirNumeroColonne();
        const position: Position = emplacement.obtenirPosition();
        for (let i = 0; i < emplacement.obtenirGrandeur(); i++) {
            let caseCourrante: Case;
            if (position === Position.Ligne) {
                caseCourrante = grille.cases.obtenirCase(ligneDepart + i, colonneDepart);
            } else {
                caseCourrante = grille.cases.obtenirCase(ligneDepart, colonneDepart + i);
            }
            if (caseCourrante.etat === EtatCase.pleine) {
                const contrainte = new Contrainte(caseCourrante.obtenirLettre(), i);
                tableauContraintes.push(contrainte);
            }
        }
        return tableauContraintes;
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
        const emplacements: EmplacementMot[] = grille.obtenirEmplacementsMot();
        // Premier mot seulement
        /*const emplacementMotCourrant = grille.obtenirEmplacementsMot()[0];
        const tailleMot = emplacementMotCourrant.obtenirGrandeur();
        const generateurMot = new GenerateurDeMotContrainteService(tailleMot);
        const mot = await generateurMot.genererMotAleatoire(tailleMot);
        grille.ajouterMotEmplacement(mot, emplacementMotCourrant);*/

        for (let i = 0; i < emplacements.length; i++) {
            const tailleMot = emplacements[i].obtenirGrandeur();
            // const contraintes = this.genererTableauContraintes(grille, emplacements[i]);
            const generateurMot = new GenerateurDeMotContrainteService(tailleMot);
            const mot = await generateurMot.genererMotAleatoire(niveau);
            grille.ajouterMotEmplacement(mot, emplacements[i]);
        }

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
