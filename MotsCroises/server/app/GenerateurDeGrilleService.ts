
import { Grille, Niveau, DIMENSION_LIGNE_COLONNE, Position } from './Grille';
import { Mot, Rarete } from './Mot';
import { EmplacementMot } from './EmplacementMot';
import { Case, EtatCase } from './Case';
import { Contrainte } from './Contrainte';
import { Indice, DifficulteDefinition } from './Indice';
import { GenerateurDeMotContrainteService } from './GenerateurDeMotContrainteService';

export const lettresDeAlphabet = 'abcdefghijklmnopqrstuvwxyz';
export const nombreLettresDeAlphabet = 26;

export const nombreMotMinimumParLigneOuColonne = 1;
export const nombreMotMaximumParLigneOuColonne = 2;

export const grandeurMotMinimum = 3;
export const grandeurMotMaximum = 10;
export const longueurEspaceNoirEntreDeuxMots = 1;

export const tentativeDeChercheUnDeuxiemeMotSurLaLigneOrColonne = 100;

let extend = require('extend');

export class GenerateurDeGrilleService {

    private motCroiseGenere: Grille;

    public genererGrille(niveau: Niveau): Grille {
        this.motCroiseGenere = this.genereGrilleVide(niveau);
        this.motCroiseGenere = this.remplirGrille(niveau);
        /*
        this.remplirGrilleVraisMots(niveau).then((grille) => {
            this.motCroiseGenere = grille;
        });
        */
        return this.motCroiseGenere;
    }

    public obtenirGrillesBase(generateur: GenerateurDeGrilleService): Grille[] {
        const grillesFacileObtenue: Grille[] = this.obtenirGrilles(generateur, Niveau.facile);
        const grillesMoyenObtenue: Grille[] = this.obtenirGrilles(generateur, Niveau.moyen);
        const grillesDifficileObtenue: Grille[] = this.obtenirGrilles(generateur, Niveau.difficile);

        return grillesFacileObtenue.concat(grillesMoyenObtenue).concat(grillesDifficileObtenue);
    }

    private obtenirGrilles(generateur: GenerateurDeGrilleService, niveau: Niveau): Grille[] {
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
        grilleVide = this.ajouterCasesMeilleurEndroit(Position.Ligne, grilleVide, grandeurMotsParLigne);
        grilleVide = this.ajouterCasesMeilleurEndroit(Position.Colonne, grilleVide, grandeurMotsParColonne);
        grilleVide.calculerPointsContraintes();

        grilleVide.genererEmplacementsMot();

        return grilleVide;
    }

    private meilleurPositionDebutFinSeChevauchent(grille: Grille, numeroLigneDebut: number, numeroColonneDebut: number,
        numeroLigneFin: number, numeroColonneFin: number) {
        const caseDebut: Case = grille.obtenirCase(numeroLigneDebut, numeroColonneDebut);
        const caseFin: Case = grille.obtenirCase(numeroLigneFin, numeroColonneFin);

        for (const emplacementMotCourant of grille.obtenirPositionsEmplacementsVides()) {
            for (let casesEmplacementMot of emplacementMotCourant.obtenirCases()) {
                if ((casesEmplacementMot.obtenirNumeroLigne() === caseDebut.obtenirNumeroLigne())
                    && (casesEmplacementMot.obtenirNumeroColonne() === caseDebut.obtenirNumeroColonne())) {
                    return true;
                }
                if ((casesEmplacementMot.obtenirNumeroLigne() === caseFin.obtenirNumeroLigne())
                    && (casesEmplacementMot.obtenirNumeroColonne() === caseFin.obtenirNumeroColonne())) {
                    return true;
                }
            }
        }
        return false;
    }

    private ajouterCasesMeilleurEndroit(position: Position, grille: Grille, grandeurMots: number[][]): Grille {
        let numeroLigneDebut: number;
        let numeroColonneDebut: number;
        let numeroLigneFin: number;
        let numeroColonneFin: number;
        let positionDebutFin: number[];
        let caseCouranteVide: Case;
        let casesEmplacementMots: Case[] = new Array();

        // Positionnez mot de la meilleur façon.
        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {

            // pour chaque mot.
            for (let j = 0; j < grandeurMots[i].length; j++) {
                casesEmplacementMots = new Array();
                positionDebutFin = this.obtenirMeilleurPositionDebutFin(grille, position, i, grandeurMots[i][j]);
                numeroLigneDebut = positionDebutFin[0];
                numeroColonneDebut = positionDebutFin[1];
                numeroLigneFin = positionDebutFin[2];
                numeroColonneFin = positionDebutFin[3];

                // Vérifier si le mot chevauche un autre présent sur la même colonne | même ligne.
                if (!this.meilleurPositionDebutFinSeChevauchent(grille, numeroLigneDebut,
                    numeroColonneDebut, numeroLigneFin, numeroColonneFin) || j === 0) {

                    // Changer l'état des cases à vide.
                    switch (position) {
                        case Position.Ligne:
                            for (let k = numeroColonneDebut; k <= numeroColonneFin; k++) {
                                caseCouranteVide = grille.obtenirCaseSelonPosition(position, i, k);
                                caseCouranteVide.etat = EtatCase.vide;
                                casesEmplacementMots.push(caseCouranteVide);
                            }
                            break;

                        case Position.Colonne:
                            for (let k = numeroLigneDebut; k <= numeroLigneFin; k++) {
                                caseCouranteVide = grille.obtenirCaseSelonPosition(position, i, k);
                                caseCouranteVide.etat = EtatCase.vide;
                                casesEmplacementMots.push(caseCouranteVide);
                            }
                            break;
                    }
                }
            }
        }

        return grille;
    }

    private obtenirMeilleurPositionDebutFin(grille: Grille, position: Position, positionCourante: number, grandeurMot: number): number[] {
        const meilleurPosition: number[] = [0, 0, 0, 0]; // [xDebut, yDebut, xFin, yFin]
        let meilleurPositionIndex: number;

        grille.calculerPointsContraintes();

        switch (position) {
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

    private obtenirGrandeurMots(nombreMots: number[]): number[][] {
        const grandeurMots: number[][] = new Array(DIMENSION_LIGNE_COLONNE);
        let grandeurMotLigne: number;

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            grandeurMots[i] = new Array();
            grandeurMotLigne = this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMotMaximum);

            grandeurMots[i].push(grandeurMotLigne);

            if (this.peutAccueillirSecondMot(nombreMots[i], grandeurMots[i][0])) {
                grandeurMots[i].push(this.obtenirGrandeurSecondMot(grandeurMots[i][0]));
            }
        }

        return grandeurMots;
    }

    private peutAccueillirSecondMot(nombreMots: number, grandeurPremierMot: number): boolean {
        const grandeurMaximumDuProchainMot: number = grandeurMotMaximum - grandeurPremierMot - longueurEspaceNoirEntreDeuxMots;

        return ((nombreMots === nombreMotMaximumParLigneOuColonne) && (grandeurMaximumDuProchainMot >= grandeurMotMinimum));
    }

    private obtenirGrandeurSecondMot(grandeurPremierMot: number): number {
        const grandeurMaximumDuProchainMot: number = grandeurMotMaximum - grandeurPremierMot - longueurEspaceNoirEntreDeuxMots;

        return this.nombreAleatoireEntreXEtY(grandeurMotMinimum, grandeurMaximumDuProchainMot);
    }

    private obtenirNombreMots(): number[] {
        const nombreMots: number[] = new Array(DIMENSION_LIGNE_COLONNE);

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const grandeurMot: number = this.nombreAleatoireEntreXEtY(nombreMotMinimumParLigneOuColonne,
                nombreMotMaximumParLigneOuColonne);

            nombreMots[i] = grandeurMot;
        }

        return nombreMots;
    }

    private remplirGrille(niveau: Niveau): Grille {
        const grillePlein = this.motCroiseGenere;

        while (!grillePlein.estComplete()) {
            for (const emplacementMotCourant of grillePlein.obtenirPositionsEmplacementsVides()) {

                let motAjoute = false;

                while (!motAjoute) {
                    const grandeur = emplacementMotCourant.obtenirGrandeur();

                    ///////MOCKING/DU/DICTIONNAIRE///////
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
                        grillePlein.ajouterMot(motIdiot, emplacementMotCourant.obtenirCaseDebut().obtenirNumeroLigne(),
                            emplacementMotCourant.obtenirCaseDebut().obtenirNumeroColonne(), emplacementMotCourant.obtenirCaseFin().obtenirNumeroLigne(),
                            emplacementMotCourant.obtenirCaseFin().obtenirNumeroColonne());
                        motAjoute = true;
                    }
                }
            }
        }
        return grillePlein;
    }


    // REMPLIR GRILLE AVEC VRAIES MOTS
    private async remplirGrilleVraisMots(niveau: Niveau): Promise<Grille> {
        let motVide: boolean;
        let motAjoute: boolean;
        let GrillePlein = this.motCroiseGenere;
        //Tableau qui garde en memoire une grille pour chaque ajout dans le but d utiliser le backtracking
        let tableauGrilles: Grille[] = new Array();
        let grilleTemp = GrillePlein.copieGrille();
        tableauGrilles.push(grilleTemp);  

        while (!GrillePlein.estComplete()) {
            for (let emplacementMotCourant of GrillePlein.obtenirPositionsEmplacementsVides()) {
                console.log("emplacement suivant : ligne = " + emplacementMotCourant.obtenirCaseDebut().obtenirNumeroLigne() + " col = " + emplacementMotCourant.obtenirCaseDebut().obtenirNumeroColonne() + " ligne = " + emplacementMotCourant.obtenirCaseFin().obtenirNumeroLigne() + " col = " + emplacementMotCourant.obtenirCaseFin().obtenirNumeroColonne());
                motVide = false;
                motAjoute = false;
                let tableauContraintes: Contrainte[] = new Array();
                tableauContraintes = this.genererTableauContraintes(GrillePlein, emplacementMotCourant);
                let monGenerateurDeMot = new GenerateurDeMotContrainteService(emplacementMotCourant.obtenirGrandeur(), tableauContraintes);

                try {
                    let mot = await monGenerateurDeMot.genererMotAleatoire(niveau);
                    console.log("mot avant d ajouter : " + mot.obtenirLettres());
                    if (mot.obtenirLettres() === '') {
                        //Si on ne trouve pas de mot
                        console.log("On ne trouve pas de mot");
                        tableauGrilles.pop();
                        GrillePlein = tableauGrilles[tableauGrilles.length - 1];
                        motVide = true;
                    }
                    if (!GrillePlein.contientDejaLeMot(mot) && !motVide) {
                        GrillePlein.ajouterMot(mot, emplacementMotCourant.obtenirCaseDebut().obtenirNumeroLigne(),
                            emplacementMotCourant.obtenirCaseDebut().obtenirNumeroColonne(), emplacementMotCourant.obtenirCaseFin().obtenirNumeroLigne(),
                            emplacementMotCourant.obtenirCaseFin().obtenirNumeroColonne());
                        tableauGrilles.push(GrillePlein.copieGrille());
                        motAjoute = true;
                    }
                }
                catch (Exception) {
                    console.log(Exception);
                    throw Exception;
                }
            }
        }
        return GrillePlein;
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private genererTableauContraintes(grille: Grille, emplacement: EmplacementMot): Contrainte[] {
        const grandeur = emplacement.obtenirGrandeur();
        let tableauContraintes: Contrainte[] = new Array();

        //Contraintes de l emplacement courant
        for (let i = 0; i < emplacement.obtenirCases().length; i++) {
            if (emplacement.obtenirCase(i).obtenirEtat() === EtatCase.pleine) {
                let nouvelleContrainte = new Contrainte(emplacement.obtenirCase(i).obtenirLettre(), i);
                tableauContraintes.push(nouvelleContrainte);
            }
        }
        return tableauContraintes;
    }

}
