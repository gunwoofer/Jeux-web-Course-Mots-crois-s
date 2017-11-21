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
        for (let i = 0; i < 4; i++) {
            const tailleMot = emplacements[i].obtenirGrandeur();
            const contraintes = this.genererTableauContraintes(grille, emplacements[i]);
            this.afficherContraintes(contraintes);
            const generateurMot = new GenerateurDeMotContrainteService(tailleMot);
            const mot = await generateurMot.genererMotAleatoire(niveau);
            grille.ajouterMotEmplacement(mot, emplacements[i]);
        }

        return grille;
    }

    private afficherContraintes(contraintes: Contrainte[]): void {
        if (contraintes.length === 0) {
            console.log('Aucune contrainte');
        } else {
            console.log('Calcul des contraintes...');
            for (let i = 0; i < contraintes.length; i++) {
                console.log('Contraintes n°', i);
                console.log('Lettre: ', contraintes[i].obtenirLettre(), ', Position: ', contraintes[i].obtenirPositionContrainte());
            }
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
            } else if (position === Position.Colonne) {
                caseCourrante = grille.cases.obtenirCase(ligneDepart, colonneDepart + i);
            }
            if (caseCourrante.etat === EtatCase.pleine) {
                console.log('Contrainte trouvée !');
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
