
import { Grille, Niveau, DIMENSION_LIGNE_COLONNE, Position } from './Grille';
import { MotComplet, Rarete } from './MotComplet';
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
export const grandeurMotMaximum = 6;
export const longueurEspaceNoirEntreDeuxMots = 1;

export const tentativeDeChercheUnDeuxiemeMotSurLaLigneOrColonne = 100;
export const LETTRE_PAR_DEFAUT_A_INSERER_MOCK_GRILLE = 'a';



let extend = require('extend');

export class GenerateurDeGrilleService {

    private motCroiseGenere: Grille;

    public genererGrille(niveau: Niveau): Grille {
        this.motCroiseGenere = this.genereGrilleVide(niveau);
        this.motCroiseGenere = this.remplirGrille(niveau);
        
        return this.motCroiseGenere;
    }

    public genererGrilleMemeLettrePartout(niveau: Niveau): Grille {
        this.motCroiseGenere = this.genereGrilleVide(niveau);
        this.motCroiseGenere = this.remplirGrille(niveau, true);
        
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

        for (const emplacementMotCourant of grille.obtenirEmplacementsMot()) {
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

    private remplirGrille(niveau: Niveau, toujoursMemeLettre: boolean = false): Grille {
        const grillePlein = this.motCroiseGenere;

        while (!grillePlein.estComplete()) {
            for (const emplacementMotCourant of grillePlein.obtenirEmplacementsMot()) {

                let motAjoute = false;

                while (!motAjoute) {
                    const grandeur = emplacementMotCourant.obtenirGrandeur();
                    let chaineIdiote = '';

                    if(!toujoursMemeLettre) {
                        for (let i = 0; i < grandeur; i++) {
                            chaineIdiote = chaineIdiote + lettresDeAlphabet.charAt(this.nombreAleatoireEntreXEtY(1, nombreLettresDeAlphabet));
                        }
                    }  else {
                        for (let i = 0; i < grandeur; i++) {
                            chaineIdiote = chaineIdiote + LETTRE_PAR_DEFAUT_A_INSERER_MOCK_GRILLE;
                        }
                    }

                    const indiceIdiot = new Indice(['definition facile', 'definition un peu difficile', 'definition dure de ouuuuf']);
                    const motIdiot: MotComplet = new MotComplet(chaineIdiote, indiceIdiot);

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

                    if (toujoursMemeLettre || !grillePlein.contientDejaLeMot(motIdiot)) {
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
        let compteur_iteration: number = 0;
        let GrillePlein = this.motCroiseGenere.copieGrille();
        //Tableau de backtracking
        let tableauGrilles: Grille[] = new Array();
        tableauGrilles.push(GrillePlein.copieGrille());
        GrillePlein.affichageConsole();

        while (!GrillePlein.estComplete()) {
            let emplacementMotCourant = GrillePlein.genererEmplacementPlusDeContraintes();
            console.log("Iteration : " + compteur_iteration);
            console.log("emplacement suivant : ligne = " + emplacementMotCourant.obtenirCaseDebut().obtenirNumeroLigne() + " col = " + emplacementMotCourant.obtenirCaseDebut().obtenirNumeroColonne() + " ligne = " + emplacementMotCourant.obtenirCaseFin().obtenirNumeroLigne() + " col = " + emplacementMotCourant.obtenirCaseFin().obtenirNumeroColonne());
            let tableauContraintes = this.genererTableauContraintes(GrillePlein, emplacementMotCourant);
            let monGenerateurDeMot = new GenerateurDeMotContrainteService(emplacementMotCourant.obtenirGrandeur(), tableauContraintes);
            try {
                let mot = await monGenerateurDeMot.genererMotAleatoire(niveau);
                if (!GrillePlein.contientDejaLeMot(mot)) { 
                    GrillePlein.ajouterMotEmplacement(mot, emplacementMotCourant);
                    tableauGrilles.push(GrillePlein.copieGrille());
                    GrillePlein.affichageConsole();
                    compteur_iteration++;
                }
            }
            catch (Exception) {
                //Si on ne trouve pas de mot
                console.log(Exception + "=> On revient en arriere");
                tableauGrilles.pop();
                let dernierMot: MotComplet = GrillePlein.obtenirMot()[GrillePlein.obtenirMot().length - 1];
                GrillePlein.affichageConsole();
                compteur_iteration++;
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
            // On perd la liaison entre l emplacement et la case alors on utilise les coord de l emplacement et on se refere a la grille
            let ligne = emplacement.obtenirCase(i).obtenirNumeroLigne();
            let colonne = emplacement.obtenirCase(i).obtenirNumeroColonne();
            if (grille.obtenirCase(ligne, colonne).etat === EtatCase.pleine) {
                let nouvelleContrainte = new Contrainte(grille.obtenirCase(ligne, colonne).obtenirLettre(), i);
                tableauContraintes.push(nouvelleContrainte);
            }
        }
        return tableauContraintes;
    }

   



    /*
    private async remplirGrilleVraisMotsBannissement(niveau: Niveau): Promise<Grille> {
        
        let compteur_iteration: number = 0;
        let GrillePlein = this.motCroiseGenere.copieGrille();
        let motsBannisParIndiceEmplacement: string[][] = new Array(GrillePlein.emplacementMots.length);
        for(let i = 0; i < motsBannisParIndiceEmplacement.length; i++) {
            motsBannisParIndiceEmplacement[i] = new Array();
        }
        //Tableau de backtracking
        let tableauGrilles: Grille[] = new Array();
        tableauGrilles.push(GrillePlein.copieGrille());
        GrillePlein.affichageConsole();
        let emplacementPlusContraignant: EmplacementMot;
        let emplacementPrecedent: EmplacementMot;
        let motbanni: boolean = false;
        let compteur_essai: number = 0;
        while (!GrillePlein.estComplete()) {
            console.log("nombre de mots :  " + GrillePlein.emplacementMots.length);
            if(emplacementPlusContraignant != undefined) {
                emplacementPrecedent = emplacementPlusContraignant.copieEmplacement();
            }
            emplacementPlusContraignant = GrillePlein.genererEmplacementPlusDeContraintes();
            let tableauContraintes = this.genererTableauContraintes(GrillePlein, emplacementPlusContraignant);
            let monGenerateurDeMot = new GenerateurDeMotContrainteService(emplacementPlusContraignant.obtenirGrandeur(), tableauContraintes);
            try {
                let mot = await monGenerateurDeMot.genererMotAleatoire(niveau);
                let indice: number = GrillePlein.trouverIndiceEmplacement(emplacementPlusContraignant);
                if(this.motEstBanni(indice, mot, motsBannisParIndiceEmplacement)){
                    motbanni = true;
                    throw new Error("mot banni de cet emplacement");
                }
                if(!GrillePlein.contientDejaLeMot(mot)){
                    GrillePlein.ajouterMotEmplacement(mot, emplacementPlusContraignant);
                    tableauGrilles.push(GrillePlein.copieGrille());
                    GrillePlein.affichageConsole();
                }
            }
            catch(Erreur) {
                console.log(Erreur);
                if(!motbanni) {
                    try {
                        let indice: number = GrillePlein.trouverIndiceEmplacement(emplacementPrecedent);
                        let motABannir = GrillePlein.trouverMotEmplacement(emplacementPrecedent);
                        motsBannisParIndiceEmplacement[indice].push(motABannir.obtenirLettres());
                    }
                    catch{
                        tableauGrilles.pop();
                        GrillePlein = tableauGrilles[tableauGrilles.length - 1].copieGrille();
                        GrillePlein.affichageConsole();
                        motbanni = false;
                    }
                }
                tableauGrilles.pop();
                GrillePlein = tableauGrilles[tableauGrilles.length - 1].copieGrille();
                GrillePlein.affichageConsole();
                motbanni = false;
            }
        }
        return GrillePlein;
    }

    public motEstBanni(indice: number, mot: Mot, listeMotsBanni: string[][]): boolean {
        for(let i = 0; i < listeMotsBanni[indice].length; i++ ) {
            if(mot.obtenirLettres() == listeMotsBanni[indice][i]){
                return true;
            }
        }
        return false;
        */
}
