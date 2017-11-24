import { RechercheMots } from './mots/RechercheMots';
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
import { Indice } from './Indice';

export const NOMBRE_DE_GRILLE = 5;
export const PAS_DE_DEFINITION = ['Indice 1', 'Indice 2', 'Indice 3'];

export class GenerateurDeGrilleService {
    protected motCroiseGenere: Grille;
    private generateurDeGrilleVide: GenerateurDeGrilleVide = new GenerateurDeGrilleVide();

    public async genererGrille(niveau: Niveau): Promise<Grille> {
        try {
            this.motCroiseGenere = await this.remplirGrille(niveau, this.generateurDeGrilleVide.genereGrilleVide(niveau));
        } catch (e) {
            console.log(e);
            console.log('Regénération de la grille...');
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

    public async obtenirGrillesBase(): Promise<Grille[]> {
        const grillesFacileObtenue: Grille[] = await this.obtenirGrilles(Niveau.facile);
        const grillesMoyenObtenue: Grille[] = await this.obtenirGrilles(Niveau.moyen);
        const grillesDifficileObtenue: Grille[] = await this.obtenirGrilles(Niveau.difficile);

        return grillesFacileObtenue.concat(grillesMoyenObtenue).concat(grillesDifficileObtenue);
    }

    private async obtenirGrilles(niveau: Niveau): Promise<Grille[]> {
        const grilles: Grille[] = new Array();
        for (let i = 0; i < NOMBRE_DE_GRILLE; i++) {
            const grilleAAjouter = await this.genererGrille(niveau);
            grilles.push(grilleAAjouter);
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
        for (const emplacement of emplacements) {
            // let nEssaiAjoutDeMot = 0;
            const tailleMot = emplacement.obtenirGrandeur();
            const contraintes = this.genererTableauContraintes(grille, emplacement);
            // const generateurMot = new GenerateurDeMotContrainteService(tailleMot, contraintes);
            // const emplacementsIntersections = this.obtenirEmplacementsIntersection(grille, emplacement);
            const chaineMot =  RechercheMots.rechercherMot(tailleMot, contraintes);
            if (chaineMot === undefined) {
                throw new Error('Grille impossible');
            }
            let mot: MotComplet;
            mot = new MotComplet(chaineMot, new Indice(PAS_DE_DEFINITION));
            /*while (!this.motEstPossibleAInserer(emplacementsIntersections, grille, niveau)) {
                // mot = await generateurMot.genererMotAleatoire(niveau);
                mot = new MotComplet(RechercheMots.rechercherMot(tailleMot, contraintes), new Indice(PAS_DE_DEFINITION));
                nEssaiAjoutDeMot++;
                if (nEssaiAjoutDeMot > 50) {
                    throw new Error ('Trop d\'essais !');
                }
                if (mot.lettres === '') {
                    throw new Error('Aucun mot disponible');
                }
            }*/
            grille.ajouterMotEmplacement(mot, emplacement);
            this.affichageConsole(grille);
        }
        console.log('Grille terminée !');
        return grille;
    }

    /*private async motEstPossibleAInserer(emplacementsIntersections: EmplacementMot[], grille: Grille, niveau: Niveau): Promise<boolean> {
        if (emplacementsIntersections.length > 0) {
            for (const emplacementIntersection of emplacementsIntersections) {
                const tailleMotIntersection = emplacementIntersection.obtenirGrandeur();
                const contraintesIntersection = this.genererTableauContraintes(grille, emplacementIntersection);
                // const generateurMotIntersection = new GenerateurDeMotContrainteService(tailleMotIntersection, contraintesIntersection);
                try {
                    const chaineMot =  RechercheMots.rechercherMot(tailleMot, contraintes);
                    if (chaineMot === undefined) {
                        throw new Error('Grille impossible');
                    }
                    const mot = new MotComplet(chaineMot, new Indice(PAS_DE_DEFINITION));
                    if (mot.lettres === '') {
                        throw Error('Aucun mot trouvé !');
                    }
                    // await generateurMotIntersection.genererMotAleatoire(niveau);
                } catch (e) {
                    return false;
                }
            }
        }
        return true;
    }*/

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

    private obtenirEmplacementsIntersection(grille: Grille, emplacement: EmplacementMot): EmplacementMot[] {
        const emplacementMots: EmplacementMot[] = new Array();
        const casesEmplacement: Case[] = grille.obtenirCasesSelonCaseDebut(
                                                                            emplacement.obtenirCaseDebut(),
                                                                            emplacement.obtenirPosition(),
                                                                            emplacement.obtenirGrandeur());
        for (const caseCourrante of casesEmplacement) {
            for (const emplacementGrille of grille.obtenirEmplacementsMot()) {
                if (!emplacementGrille.estPareilQue(emplacement) &&
                    this.caseEstEnIntersectionAvecEmplacement(caseCourrante, emplacementGrille, grille)) {
                        emplacementMots.push(emplacementGrille);
                }
            }
        }
        return emplacementMots;
    }

    private caseEstEnIntersectionAvecEmplacement(caseCourrante: Case, emplacement: EmplacementMot, grille: Grille): boolean {
        const casesEmplacement: Case[] = grille.obtenirCasesSelonCaseDebut(
                                                                            emplacement.obtenirCaseDebut(),
                                                                            emplacement.obtenirPosition(),
                                                                            emplacement.obtenirGrandeur());
        for (const caseEmplacement of casesEmplacement) {
            if (caseEmplacement.obtenirNumeroColonne() === caseCourrante.obtenirNumeroColonne() &&
                caseEmplacement.obtenirNumeroLigne() === caseCourrante.obtenirNumeroLigne()) {
                    return true;
                }
        }
        return false;
    }
}
