
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

export enum Position {
    Ligne,
    Colonne
}

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
        const grilleVide = new Grille();
        

        // Pour chaque ligne & colonne, on créer un nombre équivaut aux nombre de mots.
        const nombreMotsParLigne: number[] = this.obtenirNombreMots();
        const nombreMotsParColonne: number[] = this.obtenirNombreMots();

        

        // Pour chaque mot de lignes & colonnes, on créer un nombre équivaut à la longueur du mot. 
        const grandeurMotsParLigne: number[][] = this.obtenirMotsParLigne(nombreMotsParLigne);
        const grandeurMotsParColonne: number[][] = this.obtenirMotsParLigne(nombreMotsParColonne);

        

        // Pour chaque mot de lignes & colonnes, positionnez-le pour que celui-ci est le moins d'intersection possible.
        let xDebut:number;
        let yDebut:number;
        let xFin:number;
        let yFin:number;
        let positionDebutFin:number[];

        // Ajout emplacement des mots sur les lignes.
        for(let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            positionDebutFin = this.obtenirMeilleurPositionDebutFin(grilleVide, Position.Ligne, i, grandeurMotsParLigne[i][0]);
            xDebut = positionDebutFin[0];
            yDebut = positionDebutFin[1];
            xFin = positionDebutFin[2];
            yFin = positionDebutFin[3];

            grilleVide.ajouterEmplacementMot(
                new EmplacementMot(grilleVide.obtenirCase(xDebut, yDebut), grilleVide.obtenirCase(xFin, yFin)));

        }

        // Ajout emplacement des mots sur les colonnes.
        for(let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {

            grilleVide.ajouterEmplacementMot(
                new EmplacementMot(grilleVide.obtenirCase(xDebut, yDebut), grilleVide.obtenirCase(xFin, yFin)));
                
        }

        

        return grilleVide;
    }

    private obtenirMeilleurPositionDebutFin(grille: Grille, position: Position, positionCourante: number, grandeurMot: number):number[] {
        let meilleurPosition:number[] = [0, 0, 0, 0]; // [xDebut, yDebut, xFin, yFin]


        switch(position) {
            case Position.Ligne:
            
                // Position dans la ligne courante.
                meilleurPosition[0] = positionCourante;
                meilleurPosition[2] = positionCourante;

                let caseCourante: Case;
                let casePouvantCreerIntersection: Case;

                for(let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
                    caseCourante = grille.obtenirCase(positionCourante, i);   
                    
                    // Cas une case en bas contient une lettre.
                    casePouvantCreerIntersection = grille.obtenirCase(positionCourante + 1, i);
                    if(casePouvantCreerIntersection !== null) {
                        if(casePouvantCreerIntersection.etat === EtatCase.pleine) {
                            caseCourante.pointsDeContraintes++;
                        }
                    }
                    
                    // Cas une case à droite contient une lettre.
                    casePouvantCreerIntersection = grille.obtenirCase(positionCourante, i + 1);
                    if(casePouvantCreerIntersection !== null) {
                        if(casePouvantCreerIntersection.etat === EtatCase.pleine) {
                            caseCourante.pointsDeContraintes++;
                        }
                    }
                    
                    // Cas une case en haut contient une lettre.
                    casePouvantCreerIntersection = grille.obtenirCase(positionCourante - 1, i);
                    if(casePouvantCreerIntersection !== null) {
                        if(casePouvantCreerIntersection.etat === EtatCase.pleine) {
                            caseCourante.pointsDeContraintes++;
                        }
                    }
                    
                    // Cas une case à gauche contient une lettre.
                    casePouvantCreerIntersection = grille.obtenirCase(positionCourante, i - 1);
                    if(casePouvantCreerIntersection !== null) {
                        if(casePouvantCreerIntersection.etat === EtatCase.pleine) {
                            caseCourante.pointsDeContraintes++;
                        }
                    }
                }

                // trouver la meilleur position.
                let meilleurPositionYDebut:number = 0;
                let meilleurPointage: number = 0;

                let pointageCourant: number;
                let positionCaseYDebut: number;
                let positionYCaseCourante:number

                for(let i = 0; i < this.obtenirLaPositionDeLaPremiereLettreLimiteDuMot(grandeurMot); i++) {
                    pointageCourant = 0;
                    positionCaseYDebut = i;
                    
                    for(let j = 0; j < grandeurMot; j++) {
                        positionYCaseCourante = i + j;
                        caseCourante = grille.obtenirCase(positionCourante, positionYCaseCourante);
                        
                        pointageCourant += caseCourante.pointsDeContraintes;
                    }

                    if(i === 0 || meilleurPointage > pointageCourant)
                    {
                        meilleurPositionYDebut = positionCaseYDebut;
                        meilleurPointage = pointageCourant;
                    }
                }
                
                // assignation des positions.
                meilleurPosition[1] = meilleurPositionYDebut;
                meilleurPosition[3] = meilleurPositionYDebut + grandeurMot - 1;

            break;

            case Position.Colonne:

                // Position dans la colonne courante.
                meilleurPosition[1] = positionCourante;
                meilleurPosition[3] = positionCourante;

            break;
        }

        return meilleurPosition;
    }

    private obtenirLaPositionDeLaPremiereLettreLimiteDuMot(grandeurMot: number): number {
        return DIMENSION_LIGNE_COLONNE - grandeurMot + 1;
    }

    private obtenirMotsParLigne(nombreMots:number[]): number[][] {
        const grandeurMots: number[][] = new Array(DIMENSION_LIGNE_COLONNE);

        for(let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            let grandeurMotLigne: number = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMotMaximum);

            grandeurMots[i].push(grandeurMotLigne);

            let grandeurMaximumDuProchainMot: number;            

            if (nombreMots[i] > nombreMotMaximumParLigneOuColonne) {
                while (!this.peutAccueillirPlusieursMots(grandeurMots[i][0])) {
                    grandeurMotLigne = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMotMaximum);
                    
                    grandeurMots[i][0] = grandeurMotLigne;
                }

                grandeurMaximumDuProchainMot = grandeurMotMaximum - (grandeurMots[i][0] + longueurEspaceNoirEntreDeuxMots);
                grandeurMotLigne = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMaximumDuProchainMot);

                grandeurMots[i].push(grandeurMotLigne);
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

    private genereGrilleVideMock(): Grille {

        let grilleVide = new Grille();

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
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(0, 5), grilleVide.obtenirCase(0, 8)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(1, 0), grilleVide.obtenirCase(1, 5)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(2, 5), grilleVide.obtenirCase(2, 9)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(3, 0), grilleVide.obtenirCase(3, 5)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(4, 3), grilleVide.obtenirCase(4, 9)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(5, 0), grilleVide.obtenirCase(5, 6)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(6, 5), grilleVide.obtenirCase(6, 9)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(7, 0), grilleVide.obtenirCase(7, 4)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(8, 4), grilleVide.obtenirCase(8, 9)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(9, 1), grilleVide.obtenirCase(9, 4)));

        // Mots des colonnes
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(5, 0), grilleVide.obtenirCase(8, 0)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(0, 1), grilleVide.obtenirCase(5, 1)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(5, 2), grilleVide.obtenirCase(9, 2)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(0, 3), grilleVide.obtenirCase(5, 3)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(3, 4), grilleVide.obtenirCase(9, 4)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(0, 5), grilleVide.obtenirCase(6, 5)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(4, 6), grilleVide.obtenirCase(9, 6)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(0, 7), grilleVide.obtenirCase(4, 7)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(4, 8), grilleVide.obtenirCase(9, 8)));
        grilleVide.ajouterEmplacementMot(new EmplacementMot(grilleVide.obtenirCase(1, 9), grilleVide.obtenirCase(4, 9)));

        return grilleVide;
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