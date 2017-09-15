
import { Grille, Niveau, DIMENSION_LIGNE_COLONNE } from './Grille';
import { Mot, Rarete } from './Mot';
import { EmplacementMot } from './EmplacementMot';
import { Case, EtatCase } from './Case';
import { CasePleine } from './CasePleine';
import { Indice, DifficulteDefinition } from './Indice';

export const lettresDeAlphabet = 'abcdefghijklmnopqrstuvwxyz';
export const nombreLettresDeAlphabet = 26;

export const nombreMotMinimumParLigneOuColonne = 1;
export const nombreMotMaximumParLigneOuColonne = 2;

export const grandeurMotMinimum = 3;
export const grandeurMotMaximum = 10;
export const longueurEspaceNoirEntreDeuxMots = 1;

export class GenerateurDeGrilleService {

    private motCroiseGenere: Grille = new Grille();


    public constructor() {

    }

    public genererGrille(niveau: Niveau): Grille {
        //Algorithme de generation
        this.motCroiseGenere = this.genereGrilleVideMock();
        this.motCroiseGenere = this.remplirGrille(niveau);
        return this.motCroiseGenere;
    }

    public genereGrilleVide(): Grille {
        const motCroiseVide = new Grille();
        

        // Pour chaque ligne & colonne, on créer un nombre équivaut aux nombre de mots.
        const nombreMotsParLigne: number[] = new Array(DIMENSION_LIGNE_COLONNE);
        const nombreMotsParColonne: number[] = new Array(DIMENSION_LIGNE_COLONNE);

        for(let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const grandeurMotLigne: number = this.nombreAleatoireEntreXEtY(nombreMotMinimumParLigneOuColonne,
                nombreMotMaximumParLigneOuColonne);
            const grandeurMotColonne:number = this.nombreAleatoireEntreXEtY(nombreMotMinimumParLigneOuColonne,
                nombreMotMaximumParLigneOuColonne);

            nombreMotsParLigne[i] = grandeurMotLigne;
            nombreMotsParColonne[i] = grandeurMotColonne;
        }

        // Pour chaque mot de lignes & colonnes, on créer un nombre équivaut à la longueur du mot. 
        const grandeurMotsParLigne: number[][] = new Array(DIMENSION_LIGNE_COLONNE);
        const grandeurMotsParColonne: number[][] = new Array(DIMENSION_LIGNE_COLONNE);

        for(let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            let grandeurMotLigne: number = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMotMaximum);
            let grandeurMotColonne: number = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMotMaximum);

            grandeurMotsParLigne[i].push(grandeurMotLigne);
            grandeurMotColonne[i].push(grandeurMotColonne);

            let grandeurMaximumDuProchainMot: number;            

            if (nombreMotsParLigne[i] > nombreMotMaximumParLigneOuColonne) {

                if (this.peutAccueillirPlusieursMots(grandeurMotsParLigne[i][0])) {
                    grandeurMaximumDuProchainMot = grandeurMotMaximum - (grandeurMotsParLigne[i][0] + longueurEspaceNoirEntreDeuxMots);
                    grandeurMotLigne = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMaximumDuProchainMot);

                    grandeurMotsParLigne[i].push(grandeurMotLigne);
                } else {
                    // On n'a pas assez d'espace pour ajouter un mot, alors on ajuste le nombre de mots pour cette ligne.
                    nombreMotsParLigne[i] = 1;
                }

            }

            if (nombreMotsParColonne[i] > nombreMotMaximumParLigneOuColonne) {

                if (this.peutAccueillirPlusieursMots(grandeurMotsParColonne[i][0])) {
                    grandeurMaximumDuProchainMot = grandeurMotMaximum - (grandeurMotsParLigne[i][0] + longueurEspaceNoirEntreDeuxMots);
                    grandeurMotColonne = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMaximumDuProchainMot);

                    grandeurMotColonne[i].push(grandeurMotColonne);
                } else {
                    // On n'a pas assez d'espace pour ajouter un mot, alors on ajuste le nombre de mots pour cette ligne.
                    nombreMotsParLigne[i] = 1;
                }

            }

        }

        // Pour chaque mot de lignes & colonnes, positionnez-le pour que celui-ci est le moins d'intersection possible.

        return motCroiseVide;
    }

    private peutAccueillirPlusieursMots(grandeurDuPremierMot: number): boolean {
        const grandeurAcceptablePourLePremierMot: number = grandeurMotMaximum - (grandeurMotMinimum + 1);

        return (grandeurDuPremierMot <= grandeurAcceptablePourLePremierMot);
    }

    private genereGrilleVideMock(): Grille {

        let motCroiseVide = new Grille();

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

            let motAjoute = false;

            while (!motAjoute) {
                const grandeur = emplacementMotCourant.obtenirGrandeur();
                let chaineIdiote = '';
                for (let i = 0; i < grandeur; i++) {
                    chaineIdiote = chaineIdiote + lettresDeAlphabet.charAt(this.nombreAleatoireEntreXEtY(1, nombreLettresDeAlphabet));
                }

                const indiceIdiot = new Indice(['definition facile', 'definition un peu difficile', 'definition dure de ouuuuf']);
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

    private nombreAleatoireEntreXEtY(x: number, y: number): number {
        return Math.floor((Math.random() * y) + x);
    }

}