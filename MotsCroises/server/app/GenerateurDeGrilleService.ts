
import { Grille, Niveau, DIMENSION_LIGNE_COLONNE, Position } from './Grille';
import { Mot, Rarete } from './Mot';
import { EmplacementMot } from './EmplacementMot';
import { Case, EtatCase } from './Case';
import { Indice, DifficulteDefinition } from './Indice';

export const lettresDeAlphabet = 'abcdefghijklmnopqrstuvwxyz';
export const nombreLettresDeAlphabet = 26;

export const nombreMotMinimumParLigneOuColonne = 1;
export const nombreMotMaximumParLigneOuColonne = 2;

export const grandeurMotMinimum = 3;
export const grandeurMotMaximum = 10;
export const longueurEspaceNoirEntreDeuxMots = 1;

export const tentativeDeChercheUnDeuxiemeMotSurLaLigneOrColonne = 100;

export class GenerateurDeGrilleService {

    private motCroiseGenere: Grille;

    public genererGrille(niveau: Niveau): Grille {
        // Algorithme de generation
        this.motCroiseGenere = this.genereGrilleVide(niveau);
        this.motCroiseGenere = this.remplirGrille(niveau);
        return this.motCroiseGenere;
    }

    public obtenirGrillesBase(generateur: GenerateurDeGrilleService): Grille[] {
        const grillesFacileObtenue: Grille[] = this.obtenirGrille(generateur, Niveau.facile);
        const grillesMoyenObtenue: Grille[] = this.obtenirGrille(generateur, Niveau.moyen);
        const grillesDifficileObtenue: Grille[] = this.obtenirGrille(generateur, Niveau.difficile);
        
        return grillesFacileObtenue.concat(grillesMoyenObtenue).concat(grillesDifficileObtenue);
    }

    private obtenirGrille(generateur: GenerateurDeGrilleService, niveau: Niveau): Grille[] {
        const grilles: Grille[] = new Array();
        grilles.push(generateur.genererGrille(niveau));
        grilles.push(generateur.genererGrille(niveau));
        grilles.push(generateur.genererGrille(niveau));
        grilles.push(generateur.genererGrille(niveau));
        grilles.push(generateur.genererGrille(niveau));

        return grilles;
    }

    public genereGrilleVide(niveau: Niveau): Grille {
        let grilleVide = new Grille(niveau);

        // Pour chaque ligne & colonne, on créer un nombre équivaut aux nombre de mots.
        const nombreMotsParLigne: number[] = this.obtenirNombreMots();
        const nombreMotsParColonne: number[] = this.obtenirNombreMots();

        // Pour chaque mot de lignes & colonnes, on créer un nombre équivaut à la longueur du mot. 
        const grandeurMotsParLigne: number[][] = this.obtenirGrandeurMots(nombreMotsParLigne);
        const grandeurMotsParColonne: number[][] = this.obtenirGrandeurMots(nombreMotsParColonne);

        // Pour chaque mot de lignes & colonnes, positionnez-le pour que celui-ci est le moins d'intersection possible.
        grilleVide = this.ajouterEmplacementMotsMeilleurEndroit(Position.Ligne, grilleVide, grandeurMotsParLigne);
        grilleVide = this.ajouterEmplacementMotsMeilleurEndroit(Position.Colonne, grilleVide, grandeurMotsParColonne);
        grilleVide.calculerPointsContraintes();

        return grilleVide;
    }

    private ajouterEmplacementMotsMeilleurEndroit(position: Position, grille: Grille, grandeurMots: number[][]): Grille {        
        let xDebut: number;
        let yDebut: number;
        let xFin: number;
        let yFin: number;
        let positionDebutFin: number[];
        let caseCouranteVide: Case;
        const casesEmplacementMots: Case[] = new Array();

        // Positionnez mot de la meilleur façon. 
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {

            // pour chaque mot.
            for(let j = 0; j < grandeurMots[i].length; j++ ) {
                positionDebutFin = this.obtenirMeilleurPositionDebutFin(grille, position, i, grandeurMots[i][0]);
                xDebut = positionDebutFin[0];
                yDebut = positionDebutFin[1];
                xFin = positionDebutFin[2];
                yFin = positionDebutFin[3];

                // Changer l'état de la case à vide.
                switch(position) {
                    case Position.Ligne:
                        for(let k = yDebut; k <= yFin - yDebut; k++) {
                            caseCouranteVide = grille.obtenirCaseSelonPosition(position, i, k);
                            caseCouranteVide.etat = EtatCase.vide;
                            casesEmplacementMots.push(caseCouranteVide);
                        }
                    break;

                    case Position.Colonne:
                        for(let k = xDebut; k <= xFin - xDebut; k++) {
                            caseCouranteVide = grille.obtenirCaseSelonPosition(position, i, k);
                            caseCouranteVide.etat = EtatCase.vide;
                            casesEmplacementMots.push(caseCouranteVide);
                        }
                    break;
                }
                grille.ajouterEmplacementMot(
                    new EmplacementMot(grille.obtenirCase(xDebut, yDebut), grille.obtenirCase(xFin, yFin), casesEmplacementMots));
            }
        }

        return grille;
    }

    private obtenirMeilleurPositionDebutFin(grille: Grille, position: Position, positionCourante: number, grandeurMot: number):number[] {
        const meilleurPosition: number[] = [0, 0, 0, 0]; // [xDebut, yDebut, xFin, yFin]
        let meilleurPositionIndex: number;

        grille.calculerPointsContraintes();

        switch(position) {
            case Position.Ligne:
                // Position dans la ligne courante.
                meilleurPosition[0] = positionCourante;
                meilleurPosition[2] = positionCourante;

                // trouver la meilleur position.
                meilleurPositionIndex = grille.trouverMeilleurPositionIndexDebut(grandeurMot, positionCourante, position);

                // assignation des positions.
                meilleurPosition[1] = meilleurPositionIndex;
                meilleurPosition[3] = meilleurPositionIndex + grandeurMot - 1;

            break;

            case Position.Colonne:

                // Position dans la colonne courante.
                meilleurPosition[1] = positionCourante;
                meilleurPosition[3] = positionCourante;

                // trouver la meilleur position.
                meilleurPositionIndex = grille.trouverMeilleurPositionIndexDebut(grandeurMot, positionCourante, position);

                // assignation des positions.
                meilleurPosition[0] = meilleurPositionIndex;
                meilleurPosition[2] = meilleurPositionIndex + grandeurMot - 1;

            break;
        }

        return meilleurPosition;
    }

    private obtenirGrandeurMots(nombreMots:number[]): number[][] {
        const grandeurMots: number[][] = new Array(DIMENSION_LIGNE_COLONNE);

        for(let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            grandeurMots[i] = new Array();
            let grandeurMotLigne: number = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMotMaximum);

            grandeurMots[i].push(grandeurMotLigne);

            let grandeurMaximumDuProchainMot: number;

            if (nombreMots[i] >= nombreMotMaximumParLigneOuColonne) {
                let tentative = 0;
                while (!this.peutAccueillirPlusieursMots(grandeurMots[i][0]) ||
                tentative < tentativeDeChercheUnDeuxiemeMotSurLaLigneOrColonne) {
                    grandeurMotLigne = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMotMaximum);

                    grandeurMots[i][0] = grandeurMotLigne;
                    tentative++;
                }

                grandeurMaximumDuProchainMot = grandeurMotMaximum - (grandeurMots[i][0] + longueurEspaceNoirEntreDeuxMots);

                if(grandeurMaximumDuProchainMot >= grandeurMotMinimum) {
                    grandeurMotLigne = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMaximumDuProchainMot);

                    grandeurMots[i].push(grandeurMotLigne);
                } else {
                    nombreMots[i] = 1;
                }
            }
        }

        return grandeurMots;
    }

    private obtenirNombreMots(): number[]{
        const nombreMots: number[] = new Array(DIMENSION_LIGNE_COLONNE);

        for(let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const grandeurMot: number = this.nombreAleatoireEntreXEtY(nombreMotMinimumParLigneOuColonne,
                nombreMotMaximumParLigneOuColonne);

            nombreMots[i] = grandeurMot;
        }

        return nombreMots;
    }

    private peutAccueillirPlusieursMots(grandeurDuPremierMot: number): boolean {
        const grandeurAcceptablePourLePremierMot: number = grandeurMotMaximum - (grandeurMotMinimum + 1);

        return (grandeurDuPremierMot <= grandeurAcceptablePourLePremierMot);
    }

    private remplirGrille(niveau: Niveau): Grille {
        const grillePlein = this.motCroiseGenere;

        while (!grillePlein.estComplete()) {
            for (const emplacementMotCourant of grillePlein.obtenirPositionsEmplacementsVides()) {

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

                    if (!grillePlein.contientDejaLeMot(motIdiot)) {
                        grillePlein.ajouterMot(motIdiot, emplacementMotCourant.obtenirCaseDebut().obtenirX(),
                            emplacementMotCourant.obtenirCaseDebut().obtenirY(), emplacementMotCourant.obtenirCaseFin().obtenirX(),
                            emplacementMotCourant.obtenirCaseFin().obtenirY());
                        motAjoute = true;
                    }
                }
            }
        }
        return grillePlein;
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}