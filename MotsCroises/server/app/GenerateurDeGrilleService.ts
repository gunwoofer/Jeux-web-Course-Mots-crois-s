
import { Grille, Niveau, DIMENSION_LIGNE_COLONNE, Position } from './Grille';
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
export const grandeurMotMaximum = 7;
export const longueurEspaceNoirEntreDeuxMots = 1;

export const tentativeDeChercheUnDeuxiemeMotSurLaLigneOrColonne = 100;

export class GenerateurDeGrilleService {

    private motCroiseGenere: Grille;


    public constructor() {

    }

    public genererGrille(niveau: Niveau): Grille {
        //Algorithme de generation
        this.motCroiseGenere = this.genereGrilleVide(niveau);
        this.motCroiseGenere = this.remplirGrille(niveau);      
        return this.motCroiseGenere;
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

        return grilleVide;
    }

    private ajouterEmplacementMotsMeilleurEndroit(position: Position, grille:Grille, grandeurMots: number[][]): Grille {        
        let xDebut:number;
        let yDebut:number;
        let xFin:number;
        let yFin:number;
        let positionDebutFin:number[];
        let caseCouranteVide:Case;
        let casesEmplacementMots:Case[] = new Array();

        // Positionnez mot de la meilleur façon.
        for(let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {

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
        let meilleurPosition:number[] = [0, 0, 0, 0]; // [xDebut, yDebut, xFin, yFin]
        let meilleurPositionIndex: number;

        switch(position) {
            case Position.Ligne:
            
                // Position dans la ligne courante.
                meilleurPosition[0] = positionCourante;
                meilleurPosition[2] = positionCourante;

                grille.calculerPointsContraintes(position, positionCourante);

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

                grille.calculerPointsContraintes(position, positionCourante);

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
                let tentative:number = 0;
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

    private genereGrilleVideMock(niveau: Niveau): Grille {

        let grilleVide = new Grille(niveau, EtatCase.vide);

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
            grilleVide.changerEtatCase(EtatCase.noir, duo[0], duo[1]);
        }

        // Ajout des emplacements pour les mots dans la grille
        // Mots des lignes
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(0, 5), grilleVide.obtenirCase(0, 8), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(1, 0), grilleVide.obtenirCase(1, 5), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(2, 5), grilleVide.obtenirCase(2, 9), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(3, 0), grilleVide.obtenirCase(3, 5), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(4, 3), grilleVide.obtenirCase(4, 9), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(5, 0), grilleVide.obtenirCase(5, 6), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(6, 5), grilleVide.obtenirCase(6, 9), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(7, 0), grilleVide.obtenirCase(7, 4), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(8, 4), grilleVide.obtenirCase(8, 9), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(9, 1), grilleVide.obtenirCase(9, 4), new Array()));

        // Mots des colonnes
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(5, 0), grilleVide.obtenirCase(8, 0), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(0, 1), grilleVide.obtenirCase(5, 1), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(5, 2), grilleVide.obtenirCase(9, 2), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(0, 3), grilleVide.obtenirCase(5, 3), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(3, 4), grilleVide.obtenirCase(9, 4), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(0, 5), grilleVide.obtenirCase(6, 5), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(4, 6), grilleVide.obtenirCase(9, 6), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(0, 7), grilleVide.obtenirCase(4, 7), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(4, 8), grilleVide.obtenirCase(9, 8), new Array()));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(1, 9), grilleVide.obtenirCase(4, 9), new Array()));

        return grilleVide;
    }

    private remplirGrille(niveau: Niveau): Grille {
        let GrillePlein = this.motCroiseGenere;
        let tableauGrilles: Grille[];

        while (!GrillePlein.estComplete()) {
            for (let emplacementMotCourant of GrillePlein.obtenirPositionsEmplacementsVides()) {

                let motAjoute: boolean = false;

                while (!motAjoute) {
                    const grandeur = emplacementMotCourant.obtenirGrandeur();
                    
                    ///////MOCKING/DU/DICTIONNAIRE///////
                    let chaineIdiote = '';
                    for (let i = 0; i < grandeur; i++) {
                        chaineIdiote = chaineIdiote + lettresDeAlphabet.charAt(this.nombreAleatoireEntreXEtY(1, nombreLettresDeAlphabet));
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
                    /////////////////////////////////////////

                    if (!GrillePlein.contientDejaLeMot(motIdiot)) {
                        GrillePlein.ajouterMot(motIdiot, emplacementMotCourant.obtenirCaseDebut().obtenirX(),
                            emplacementMotCourant.obtenirCaseDebut().obtenirY(), emplacementMotCourant.obtenirCaseFin().obtenirX(),
                            emplacementMotCourant.obtenirCaseFin().obtenirY());
                        motAjoute = true;
                    }

                }
            }


        }

        return GrillePlein;
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

}