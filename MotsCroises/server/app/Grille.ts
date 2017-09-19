import { Mot } from './Mot';
import { Case, EtatCase } from './Case';
import { EmplacementMot } from './EmplacementMot';


export const DIMENSION_LIGNE_COLONNE = 10;

export enum EtatGrille {
    vide,
    encours,
    complet
}

export enum Niveau {
    facile,
    moyen,
    difficile
}


export enum Position {
    Ligne,
    Colonne
}

export class Grille {
    private mots: Mot[] = new Array();
    private emplacementMots: EmplacementMot[] = new Array();

    private cases: Case[][] = new Array(DIMENSION_LIGNE_COLONNE);

    private etat: EtatGrille;
    private niveau: Niveau;

    private nombreMotsSurLigne: number[] = new Array(DIMENSION_LIGNE_COLONNE);
    private nombreMotsSurColonne: number[] = new Array(DIMENSION_LIGNE_COLONNE);

    public constructor(niveau:Niveau, etatCaseInitial: EtatCase = EtatCase.noir) {
        this.niveau = niveau;

        // Instancie la grille vide sans espace noir.
        for(let i: number = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            this.cases[i] = new Array(DIMENSION_LIGNE_COLONNE);
            this.nombreMotsSurLigne[i] = 0;

            for(let j: number = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                const caseBlanche = new Case(i,j, etatCaseInitial);
                this.nombreMotsSurColonne[j] = 0;
                this.cases[i][j] = caseBlanche;
            }
        }
    }


    public obtenirNiveau():Niveau {
        return this.niveau;
    }

    public estComplete(): boolean {
        for (let i = 0; i < 10; i++) {
            if (((this.obtenirNombreMotsSurLigne(i) !== 1) && (this.obtenirNombreMotsSurLigne(i) !== 2))
            || ((this.obtenirNombreMotsSurColonne(i) !== 1) && (this.obtenirNombreMotsSurColonne(i) !== 2))) {
                return false;
            }
        }
        this.etat = EtatGrille.complet;
        return true;
    }

    public validerMot(): boolean {
        return true;
    }

    public obtenirCases(): Case[][] {
        return this.cases;
    }

    public obtenirCase(x: number, y: number): Case {
        if(x < 0 || y < 0 || x >= DIMENSION_LIGNE_COLONNE || y >= DIMENSION_LIGNE_COLONNE) {
            return null;
        }

        return this.cases[x][y];
    }

    public obtenirCaseSelonPosition(position:Position, indexFixe: number, index:number): Case {
        switch(position) {
            case Position.Ligne:
                return this.cases[indexFixe][index];

            case Position.Colonne:
                return this.cases[index][indexFixe];
        }
    }

    public obtenirMot(): Mot[] {
        return this.mots;
    }


    public changerEtatCase(etatCase: EtatCase, x: number, y: number): void {

        this.cases[x][y].etat = etatCase;

    }



    public ajouterEmplacementMot(emplacementMot: EmplacementMot) {
        this.emplacementMots.push(emplacementMot);
    }

    public existeEmplacementMot(xDepart: number, yDepart: number, xFin: number, yFin: number): boolean {

        for (const emplacementMotCourant of this.emplacementMots) {
            const caseDebut: Case = emplacementMotCourant.obtenirCaseDebut();
            const caseFin: Case = emplacementMotCourant.obtenirCaseFin();

            if (
                (caseDebut.obtenirX() === xDepart) &&
                (caseDebut.obtenirY() === yDepart) &&
                (caseFin.obtenirX() === xDepart) &&
                (caseFin.obtenirY() === yDepart)
            ) {
                return true;
            }

        }

        return false;

    }

    public ajouterMot(mot: Mot, xDepart: number, yDepart: number, xFin: number, yFin: number) {

        this.mots.push(mot);


        const positionDansLeMot = 0;

        // Cas du mot à l'horizontal.
        if (xDepart === xFin) {
            for (const caseCourante of this.cases[xDepart]) {
                if (this.dansLaLimiteDuMot(caseCourante.obtenirY(), yDepart, yFin) && mot.estUneLettreValide(positionDansLeMot)) {
                    caseCourante.remplirCase(mot.obtenirLettreSimplifie(positionDansLeMot));
                }
            }

            this.nombreMotsSurLigne[xDepart]++;
        }

        // Cas du mot à la vertical.
        if (yDepart === yFin) {
            for (let i = 0; i < this.cases.length; i++) {
                if (this.dansLaLimiteDuMot(i, xDepart, xFin) && mot.estUneLettreValide(positionDansLeMot)) {
                    this.cases[i][yDepart].remplirCase(mot.obtenirLettreSimplifie(positionDansLeMot));
                }
            }

            this.nombreMotsSurColonne[yDepart]++;
        }
    }

    public obtenirNombreMotsSurLigne(ligne: number): number {

        if(ligne >= DIMENSION_LIGNE_COLONNE) {
            return -1;
        }

        return this.nombreMotsSurLigne[ligne];
    }

    public obtenirNombreMotsSurColonne(ligne: number) {

        if(ligne >= DIMENSION_LIGNE_COLONNE) {
            return -1;
        }

        return this.nombreMotsSurColonne[ligne];
    }

    public obtenirPositionsEmplacementsVides(): EmplacementMot[] {
        return this.emplacementMots;
    }

    public dansLaLimiteDuMot(caseCourante: number, debutY: number, finY: number): boolean {
        if (caseCourante >= debutY && caseCourante <= finY) {
            return true;
        }

        return false;
    }

    public obtenirLongueurCases(): number {
        return this.cases.length;
    }

    public obtenirHauteurCases(): number {
        let nbrCasesY = 0;

        for (const casesDeLaLigne of this.cases) {
            if (nbrCasesY !== 0 && nbrCasesY !== casesDeLaLigne.length) {
                return -1;
            }
            nbrCasesY = casesDeLaLigne.length;
        }

        return nbrCasesY;
    }

    public contientDejaLeMot(mot: Mot) {
        for (const motCourant of this.mots) {
            if (motCourant.obtenirLettres() === mot.obtenirLettres()) {
                return true;
            }
        }

        return false;
    }

    public contientMotDuplique(): boolean {
        for (const motAChercher of this.mots) {
            let compteur = 0;
            const lettresAChercher: string = motAChercher.obtenirLettres();
            for (const motCourant of this.mots) {
                if (lettresAChercher === motCourant.obtenirLettres()) {
                    compteur++;
                }
                if (compteur > 1) {
                    return true;
                }
            }
        }

        return false;
    }


    public calculerPointsContraintes() {
        let caseCourante: Case;

        for (let i = 0; i < DIMENSION_LIGNE_COLONNE; i++) {
            for (let j = 0; j < DIMENSION_LIGNE_COLONNE; j++) {
                caseCourante = this.obtenirCase(i, j);
                caseCourante.remettrePointsContraintesAZero();
                this.calculerPointsContraintesDeLaCase(caseCourante, caseCourante.obtenirX(), caseCourante.obtenirY());
            }
        }
    }

    private calculerPointsContraintesDeLaCase(caseCourante: Case, xCourant: number, yCourant: number) {
        // Cas une case en bas contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(xCourant + 1, yCourant))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Colonne);
        }

        // Cas une case à droite contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(xCourant, yCourant + 1))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Ligne);
        }

        // Cas une case en haut contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(xCourant - 1, yCourant))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Colonne);
        }

        // Cas une case à gauche contient une lettre.
        if (this.peutAccueillirLettre(this.obtenirCase(xCourant, yCourant - 1))) {
            caseCourante.ajouterUnPointDeContrainte(Position.Ligne);
        }

        return caseCourante;
    }

    private peutAccueillirLettre(caseAVerifier: Case): boolean {
        if (caseAVerifier !== null) {
            if (caseAVerifier.etat === EtatCase.vide) {
                return true;
            }
        }

        return false;
    }


    private obtenirLaPositionDeLaPremiereLettreLimiteDuMot(grandeurMot: number): number {
        return DIMENSION_LIGNE_COLONNE - grandeurMot + 1;
    }
    public trouverMeilleurPositionIndexDebut(grandeurMot: number, positionCourante: number, position: Position): number {
        let meilleurPositionIndexDebut = 0;
        let meilleurPointage = 0;

        let pointageCourant: number;
        let positionCaseIndexDebut: number;
        let positionIndexCaseCourante: number;

        let caseCourante: Case;

        for (let i = 0; i < this.obtenirLaPositionDeLaPremiereLettreLimiteDuMot(grandeurMot); i++) {
            pointageCourant = 0;
            positionCaseIndexDebut = i;

            for (let j = 0; j < grandeurMot; j++) {
                positionIndexCaseCourante = i + j;
                caseCourante = this.obtenirCaseSelonPosition(position, positionCourante, positionIndexCaseCourante);

                pointageCourant += caseCourante.obtenirPointsDeContraintes();
            }

            if (i === 0 || meilleurPointage > pointageCourant)
            {
                meilleurPositionIndexDebut = positionCaseIndexDebut;
                meilleurPointage = pointageCourant;
            }
        }

        return meilleurPositionIndexDebut;
    }

}
