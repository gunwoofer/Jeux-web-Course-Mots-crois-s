
import { Grille, Niveau } from './Grille';
import { Mot, Rarete } from './Mot';
import { EmplacementMot } from './EmplacementMot';
import { Case, EtatCase } from './Case';
import { CasePleine } from './CasePleine';
import { Indice, DifficulteDefinition } from './Indice';

export const lettresDeAlphabet: string = "abcdefghijklmnopqrstuvwxyz";

export class GenerateurDeGrilleService {

    private motCroiseGenere: Grille = new Grille();


    public constructor() {

    }

    public genererGrille(niveau: Niveau): Grille {
        //Algorithme de generation
        this.motCroiseGenere = this.genereGrilleVide();
        this.motCroiseGenere = this.remplirGrille(niveau);
        return this.motCroiseGenere;
    }

    private genereGrilleVide(): Grille {

        let motCroiseVide = new Grille;

        let tableauNoir = new Array();

        // Cases noirs
        tableauNoir.push([0, 0]);
        tableauNoir.push([2, 0]);
        tableauNoir.push([4, 0]);
        tableauNoir.push([9, 0]);

        tableauNoir.push([6, 1]);
        tableauNoir.push([8, 1]);

        tableauNoir.push([0, 2]);
        tableauNoir.push([2, 2]);
        tableauNoir.push([4, 2]);

        tableauNoir.push([6, 3]);
        tableauNoir.push([8, 3]);

        tableauNoir.push([0, 4]);
        tableauNoir.push([2, 4]);

        tableauNoir.push([7, 5]);
        tableauNoir.push([9, 5]);

        tableauNoir.push([1, 6]);
        tableauNoir.push([3, 6]);

        tableauNoir.push([5, 7]);
        tableauNoir.push([7, 7]);
        tableauNoir.push([9, 7]);

        tableauNoir.push([1, 8]);
        tableauNoir.push([3, 8]);

        tableauNoir.push([0, 9]);
        tableauNoir.push([5, 9]);
        tableauNoir.push([7, 9]);
        tableauNoir.push([9, 9]);


        for (let duo of tableauNoir) {
            motCroiseVide.changerEtatCase(EtatCase.noir, duo[0], duo[1]);
        }

        // Ajout des emplacements pour les mots dans la grille
        // Mots des lignes
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(0, 5), motCroiseVide.obtenirCase(0, 8)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(1, 0), motCroiseVide.obtenirCase(1, 5)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(2, 5), motCroiseVide.obtenirCase(2, 9)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(3, 0), motCroiseVide.obtenirCase(3, 5)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(4, 3), motCroiseVide.obtenirCase(4, 9)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(5, 0), motCroiseVide.obtenirCase(5, 6)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(6, 5), motCroiseVide.obtenirCase(6, 9)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(7, 0), motCroiseVide.obtenirCase(7, 4)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(8, 4), motCroiseVide.obtenirCase(8, 9)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(9, 1), motCroiseVide.obtenirCase(9, 4)));

        // Mots des colonnes
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(5, 0), motCroiseVide.obtenirCase(8, 0)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(0, 1), motCroiseVide.obtenirCase(5, 1)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(5, 2), motCroiseVide.obtenirCase(9, 2)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(0, 3), motCroiseVide.obtenirCase(5, 3)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(3, 4), motCroiseVide.obtenirCase(9, 4)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(0, 5), motCroiseVide.obtenirCase(6, 5)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(4, 6), motCroiseVide.obtenirCase(9, 6)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(0, 7), motCroiseVide.obtenirCase(4, 7)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(4, 8), motCroiseVide.obtenirCase(9, 8)));
        motCroiseVide.ajouterEmplacementMot(new EmplacementMot(motCroiseVide.obtenirCase(1, 9), motCroiseVide.obtenirCase(4, 9)));

        return motCroiseVide;
    }

    private remplirGrille(niveau: Niveau): Grille {
        let GrillePlein = this.motCroiseGenere;

        for (let emplacementMotCourant of GrillePlein.obtenirPositionsEmplacementsVides()) {

            let motAjoute: boolean = false;

            while (!motAjoute) {
                const grandeur = emplacementMotCourant.obtenirGrandeur();
                let chaineIdiote = '';
                for (let i = 0; i < grandeur; i++) {
                    chaineIdiote = chaineIdiote + lettresDeAlphabet.charAt(this.nombreAleatoireEntre1Et26());
                }

                let indiceIdiot = new Indice(['definition facile', 'definition un peu difficile', 'definition dure de ouuuuf']);
                const motIdiot: Mot = new Mot(chaineIdiote, indiceIdiot);

                if (niveau === Niveau.facile) {
                    motIdiot.setRarete(Rarete.commun);
                    motIdiot.obtenirIndice().setDifficulteDefinition(DifficulteDefinition.PremiereDefinition);

                }
                if (niveau === Niveau.moyen) {
                    motIdiot.setRarete(Rarete.commun);
                    motIdiot.obtenirIndice().setDifficulteDefinition(DifficulteDefinition.DefinitionAlternative);
                }
                if (niveau === Niveau.difficile) {
                    motIdiot.setRarete(Rarete.nonCommun);
                    motIdiot.obtenirIndice().setDifficulteDefinition(DifficulteDefinition.DefinitionAlternative);
                }

                if (!GrillePlein.contientDejaLeMot(motIdiot)) {
                    GrillePlein.ajouterMot(motIdiot, emplacementMotCourant.obtenirCaseDebut().obtenirX(),
                        emplacementMotCourant.obtenirCaseDebut().obtenirY(), emplacementMotCourant.obtenirCaseFin().obtenirX(),
                        emplacementMotCourant.obtenirCaseFin().obtenirY());
                    motAjoute = true;
                }

            }

        }

        return GrillePlein;
    }

    private nombreAleatoireEntre1Et26(): number {
        return Math.floor((Math.random() * 26) + 1);
    }

}