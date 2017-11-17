import { Grille, DIMENSION_LIGNE_COLONNE } from './Grille';
import { Niveau } from '../../commun/Niveau';
import { MotComplet, Rarete } from './MotComplet';
import { EmplacementMot } from '../../commun/EmplacementMot';
import { Case, EtatCase } from '../../commun/Case';
import { Position } from '../../commun/Position';
import { Indice, DifficulteDefinition } from './Indice';
import * as grilleConstantes from './GrilleConstants';

export class GenerateurDeGrilleService {
    private motCroiseGenere: Grille;

    public genererGrille(niveau: Niveau): Grille {
        this.motCroiseGenere = this.genereGrilleVide(niveau);
        this.motCroiseGenere = this.remplirGrille(niveau);

        return this.motCroiseGenere;
    }

    public genererGrilleMock(niveau: Niveau): Grille {
        this.motCroiseGenere = this.genererGrilleVideMock(niveau);
        this.motCroiseGenere = this.remplirGrilleMock(niveau);

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
        numeroLigneFin: number, numeroColonneFin: number): boolean {
        const caseDebut: Case = grille.obtenirCase(numeroLigneDebut, numeroColonneDebut);
        const caseFin: Case = grille.obtenirCase(numeroLigneFin, numeroColonneFin);
        let casesEmplacementMot: Case[];

        for (const emplacementMotCourant of grille.obtenirEmplacementsMot()) {
            casesEmplacementMot = grille.obtenirCasesSelonCaseDebut(emplacementMotCourant.obtenirCaseDebut(),
                emplacementMotCourant.obtenirPosition(), emplacementMotCourant.obtenirGrandeur());

            for (const caseCourante of casesEmplacementMot) {
                if ((caseCourante.obtenirNumeroLigne() === caseDebut.obtenirNumeroLigne())
                    && (caseCourante.obtenirNumeroColonne() === caseDebut.obtenirNumeroColonne())) {
                    return true;
                }
                if ((caseCourante.obtenirNumeroLigne() === caseFin.obtenirNumeroLigne())
                    && (caseCourante.obtenirNumeroColonne() === caseFin.obtenirNumeroColonne())) {
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
                meilleurPositionIndex = grille.motsComplet.trouverMeilleurPositionIndexDebut(
                    grandeurMot, positionCourante, position, grille.cases);

                // assignation des positions.
                meilleurPosition[1] = meilleurPositionIndex;
                meilleurPosition[3] = meilleurPositionIndex + grandeurMot - 1;

                break;

            case Position.Colonne:

                // Position dans la colonne courante.
                meilleurPosition[1] = positionCourante;
                meilleurPosition[3] = positionCourante;

                // trouver la meilleur position.
                meilleurPositionIndex = grille.motsComplet.trouverMeilleurPositionIndexDebut(
                    grandeurMot, positionCourante, position, grille.cases);

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
            grandeurMotLigne = this.nombreAleatoireEntreXEtY(grilleConstantes.grandeurMotMinimum, grilleConstantes.grandeurMotMaximum);

            grandeurMots[i].push(grandeurMotLigne);

            if (this.peutAccueillirSecondMot(nombreMots[i], grandeurMots[i][0])) {
                grandeurMots[i].push(this.obtenirGrandeurSecondMot(grandeurMots[i][0]));
            }
        }

        return grandeurMots;
    }

    private peutAccueillirSecondMot(nombreMots: number, grandeurPremierMot: number): boolean {
        const grandeurMaximumDuProchainMot: number = grilleConstantes.grandeurMotMaximum -
            grandeurPremierMot - grilleConstantes.longueurEspaceNoirEntreDeuxMots;

        return ((nombreMots === grilleConstantes.nombreMotMaximumParLigneOuColonne) &&
                (grandeurMaximumDuProchainMot >= grilleConstantes.grandeurMotMinimum));
    }

    private obtenirGrandeurSecondMot(grandeurPremierMot: number): number {
        const grandeurMaximumDuProchainMot: number = grilleConstantes.grandeurMotMaximum -
                grandeurPremierMot - grilleConstantes.longueurEspaceNoirEntreDeuxMots;

        return this.nombreAleatoireEntreXEtY(grilleConstantes.grandeurMotMinimum, grandeurMaximumDuProchainMot);
    }

    private obtenirNombreMots(): number[] {
        const nombreMots: number[] = new Array(DIMENSION_LIGNE_COLONNE);

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            const grandeurMot: number = this.nombreAleatoireEntreXEtY(grilleConstantes.nombreMotMinimumParLigneOuColonne,
                grilleConstantes.nombreMotMaximumParLigneOuColonne);

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

                    if (!toujoursMemeLettre) {
                        for (let i = 0; i < grandeur; i++) {
                            chaineIdiote = chaineIdiote + grilleConstantes.lettresDeAlphabet.charAt(
                                this.nombreAleatoireEntreXEtY(1, grilleConstantes.nombreLettresDeAlphabet));
                        }
                    } else {
                        for (let i = 0; i < grandeur; i++) {
                            chaineIdiote = chaineIdiote + grilleConstantes.LETTRE_PAR_DEFAUT_A_INSERER_MOCK_GRILLE;
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

                    if (toujoursMemeLettre || !grillePlein.motsComplet.contientDejaLeMot(motIdiot)) {
                        grillePlein.ajouterMot(motIdiot, emplacementMotCourant.obtenirCaseDebut().obtenirNumeroLigne(),
                            emplacementMotCourant.obtenirCaseDebut().obtenirNumeroColonne(),
                            emplacementMotCourant.obtenirCaseFin().obtenirNumeroLigne(),
                            emplacementMotCourant.obtenirCaseFin().obtenirNumeroColonne());
                        motAjoute = true;
                    }
                }
            }
        }
        return grillePlein;
    }

    private genererGrilleVideMock(niveau: Niveau): Grille {
        const grilleMock: Grille = new Grille(niveau);

        // Emplacements horizontaux
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.obtenirCase(2, 6), grilleMock.obtenirCase(2, 9)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.obtenirCase(3, 0), grilleMock.obtenirCase(3, 3)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.obtenirCase(5, 0), grilleMock.obtenirCase(5, 8)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.obtenirCase(8, 3), grilleMock.obtenirCase(8, 9)));

        // Emplacements verticaux
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.obtenirCase(1, 1), grilleMock.obtenirCase(9, 1)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.obtenirCase(0, 3), grilleMock.obtenirCase(6, 3)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.obtenirCase(3, 5), grilleMock.obtenirCase(6, 5)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.obtenirCase(5, 7), grilleMock.obtenirCase(8, 7)));
        grilleMock.emplacementMots.push(new EmplacementMot(grilleMock.obtenirCase(1, 8), grilleMock.obtenirCase(5, 8)));

        return grilleMock;
    }

    private remplirGrilleMock(niveau: Niveau): Grille {
        let grilleRemplieMock: Grille = this.motCroiseGenere;

        // Mots horizontaux:
        const indice1H = new Indice(['a firm controlling influence',
            'worker who moves the camera around while a film or television show is being made']);
        const mot1H = new MotComplet('GRIP', indice1H);
        const indice2H = new Indice(['tool consisting of a combination of implements arranged to work together',
            'an organized group of workmen']);
        const mot2H = new MotComplet('GANG', indice2H);
        const indice3H = new Indice(['man-made equipment that orbits around the earth or the moon',
            'any celestial body orbiting around a planet or star']);
        const mot3H = new MotComplet('SATELLITE', indice3H);
        const indice4H = new Indice(['the point on a curve where the tangent changes from negative on the left to positive on the right',
            'the smallest possible quantity']);
        const mot4H = new MotComplet('MINIMUM', indice4H);

        // Mots verticaux:
        const indice1V = new Indice(
            ['a written assurance that some product or service will be provided or will meet certain specifications',
                'a pledge that something will happen or that something is true']);
        const mot1V = new MotComplet('GUARANTEE', indice1V);
        const indice2V = new Indice(['cheap showy jewelry or ornament on clothing', 'jewelry worn around the wrist for decoration']);
        const mot2V = new MotComplet('BANGLES', indice2V);
        const indice3V = new Indice(['a sacred place of pilgrimage', 'belonging to or derived from or associated with a divine power']);
        const mot3V = new MotComplet('HOLY', indice3V);
        const indice4V = new Indice(['uncastrated adult male sheep', 'a tool for driving or forcing something by impact']);
        const mot4V = new MotComplet('TRAM', indice4V);
        const indice5V = new Indice(['a book regarded as authoritative in its field', 'the sacred writings of the Christian religions']);
        const mot5V = new MotComplet('BIBLE', indice5V);

        for (let i = 0; i < grilleRemplieMock.emplacementMots.length; i++) {
            // Parcourt horizontal puis vertical de bas en haut et de gauche a droite
            if (i === 0) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice1H.id);
                grilleRemplieMock.ajouterMotEmplacement(mot1H, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 1) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice2H.id);
                grilleRemplieMock.ajouterMotEmplacement(mot2H, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 2) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice3H.id);
                grilleRemplieMock.ajouterMotEmplacement(mot3H, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 3) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice4H.id);
                grilleRemplieMock.ajouterMotEmplacement(mot4H, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 4) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice1V.id);
                grilleRemplieMock.ajouterMotEmplacement(mot1V, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 5) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice2V.id);
                grilleRemplieMock.ajouterMotEmplacement(mot2V, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 6) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice3V.id);
                grilleRemplieMock.ajouterMotEmplacement(mot3V, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 7) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice4V.id);
                grilleRemplieMock.ajouterMotEmplacement(mot4V, grilleRemplieMock.emplacementMots[i]);
            }
            if (i === 8) {
                grilleRemplieMock.emplacementMots[i].attribuerGuidIndice(indice5V.id);
                grilleRemplieMock.ajouterMotEmplacement(mot5V, grilleRemplieMock.emplacementMots[i]);
            }
        }

        grilleRemplieMock = this.ajouterIntersectionsMock(grilleRemplieMock);
        return grilleRemplieMock;
    }

    private ajouterIntersectionsMock(grille: Grille): Grille {
        grille.obtenirCase(2, 8).intersection = true;
        grille.obtenirCase(3, 1).intersection = true;
        grille.obtenirCase(3, 3).intersection = true;
        grille.obtenirCase(5, 1).intersection = true;
        grille.obtenirCase(5, 3).intersection = true;
        grille.obtenirCase(5, 5).intersection = true;
        grille.obtenirCase(5, 7).intersection = true;
        grille.obtenirCase(5, 8).intersection = true;
        grille.obtenirCase(8, 7).intersection = true;

        return grille;
    }

    private nombreAleatoireEntreXEtY(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
