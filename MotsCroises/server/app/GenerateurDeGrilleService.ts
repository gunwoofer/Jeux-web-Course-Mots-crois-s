import { EmplacementMot } from './../../commun/EmplacementMot';
import { Contrainte } from './Contrainte';
import { EtatCase } from './../../commun/Case';
import { Grille } from './Grille';
import { Niveau } from '../../commun/Niveau';
import { MotComplet } from './MotComplet';
import { Case } from '../../commun/Case';
import { GenerateurDeGrilleVide } from './GenerateurDeGrilleVide';
import { GenerateurDeMotContrainteService } from './GenerateurDeMotContrainteService';
import { Position } from '../../commun/Position';

export const NOMBRE_DE_GRILLE = 5;

export class GenerateurDeGrilleService {
    protected motCroiseGenere: Grille;
    private generateurDeGrilleVide: GenerateurDeGrilleVide = new GenerateurDeGrilleVide();

    public genererGrille(niveau: Niveau): Grille {
        try {
            this.motCroiseGenere = this.generateurDeGrilleVide.genereGrilleVide(niveau);
            this.generateurDeGrilleVide.affichageConsole(this.motCroiseGenere);
            this.remplirGrille(niveau, this.motCroiseGenere)
                .then((grilleRemplie) => {
                this.motCroiseGenere = grilleRemplie;
                this.affichageConsole(this.motCroiseGenere);
                }, (e) => {
                    console.log('Erreur dans reject: ', e);
                    throw new Error('Promesse de remplir grille rejetée !');
                });
        } catch (e) {
            console.log('Erreur: ', e);
            console.log('Regénération de la grille...');
            Promise.reject(e).then(() => {
                console.log('ça marche !');
                this.genererGrille(niveau);
            });
            this.genererGrille(niveau);
        }
        return this.motCroiseGenere;
    }

    public affichageConsole(grille: Grille): void {
        for (let i = 0; i < 10; i++) {
            let ligne: string;
            ligne = '';
            for (let j = 0; j < 10; j++) {
                const caseGrille: Case = grille.cases.obtenirCase(i, j);
                if (caseGrille.obtenirLettre() === '') {
                    ligne += '*';
                } else {
                    ligne += caseGrille.obtenirLettre();
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

    private trierEmplacements(emplacements: EmplacementMot[]): EmplacementMot[] {
        const emplacementsTries: EmplacementMot[] = new Array(emplacements.length);
        const emplacementsLignes: EmplacementMot[] = new Array();
        const emplacementsColonnes: EmplacementMot[] = new Array();
        for (const emplacement of emplacements) {
            if (emplacement.obtenirPosition() === Position.Colonne) {
                emplacementsColonnes.push(emplacement);
            } else {
                emplacementsLignes.push(emplacement);
            }
        }
        let iLignes = 0;
        let iColonnes = 0;
        for (let i = 0; i < emplacementsTries.length; i++) {
            if ((i % 2 === 0 && iLignes < emplacementsLignes.length) || (iColonnes === emplacementsColonnes.length)) {
                emplacementsTries[i] = emplacementsLignes[iLignes];
                iLignes++;
            }
            if ((i % 2 !== 0 && iColonnes < emplacementsColonnes.length) || (iLignes === emplacementsLignes.length)) {
                emplacementsTries[i] = emplacementsColonnes[iColonnes];
                iColonnes++;
            }
        }
        return emplacementsTries;
    }

    private async remplirGrille(niveau: Niveau, grille: Grille): Promise<Grille> {
        const emplacements: EmplacementMot[] = this.trierEmplacements(grille.obtenirEmplacementsMot());
        let i = 0;
        while (!this.estComplete(grille) && i < emplacements.length) {
            console.log('Type de l\' emplacement: ', emplacements[i].obtenirPosition());
            const tailleMot = emplacements[i].obtenirGrandeur();
            const contraintes = this.genererTableauContraintes(grille, emplacements[i]);
            const generateurMot = new GenerateurDeMotContrainteService(tailleMot, contraintes);
            try {
                const mot: MotComplet = await generateurMot.genererMotAleatoire(niveau);
                this.affichageConsole(grille);
                grille.ajouterMotEmplacement(mot, emplacements[i]);
            } catch (e) {
                console.log('Erreur data muse: ', e);
                throw new Error('Aucun mot ne fonctionne !');
            }
            i++;
        }
        console.log('Grille terminée !');
        return grille;
    }

    private genererTableauContraintes(grille: Grille, emplacement: EmplacementMot): Contrainte[] {
        const tableauContraintes: Contrainte[] = new Array();
        const ligneDepart: number = emplacement.obtenirCaseDebut().obtenirNumeroLigne();
        const colonneDepart: number = emplacement.obtenirCaseDebut().obtenirNumeroColonne();
        const position: Position = emplacement.obtenirPosition();
        for (let i = 0; i < emplacement.obtenirGrandeur(); i++) {
            let caseCourrante: Case;
            if (position === Position.Ligne) {
                caseCourrante = grille.cases.obtenirCase(ligneDepart, colonneDepart + i);
            } else {
                caseCourrante = grille.cases.obtenirCase(ligneDepart + i, colonneDepart);
            }
            if (caseCourrante.obtenirEtat() === EtatCase.pleine) {
                const contrainte = new Contrainte(caseCourrante.obtenirLettre(), i);
                tableauContraintes.push(contrainte);
            }
        }
        return tableauContraintes;
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
