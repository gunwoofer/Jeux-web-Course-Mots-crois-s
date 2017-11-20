import {Joueur} from '../../commun/Joueur';
import {Grille} from './Grille';
import {Case} from '../../commun/Case';
import {Guid} from '../../commun/Guid';
import {TypePartie} from '../../commun/TypePartie';
import {EmplacementMot} from '../../commun/EmplacementMot';
import {Niveau} from '../../commun/Niveau';
import {Indice} from './Indice';

export const LIMITE_JOUEURS = 2;
export const TEMPS_PARTIE_MINUTES = 5;
export const TEMPS_PARTIE_MILISECONDS = 60 * TEMPS_PARTIE_MINUTES * Math.pow(10, 3);

export class Partie {
    private joueurs: Joueur[] = new Array();
    private grille: Grille;
    private type: TypePartie = TypePartie.classique_a_un;
    public guid: string = Guid.generateGUID();
    private debutDePartie: number;
    private tempsAlloue: number;

    constructor(grille: Grille, joueurs: Joueur[], type: TypePartie) {
        this.grille = grille;

        this.joueurs = joueurs;

        this.type = type;
    }

    public estDebute(): boolean {
        if (this.debutDePartie === undefined) {
            return false;
        }

        return true;
    }

    public demarrerPartie(tempsAlloue: number = TEMPS_PARTIE_MILISECONDS) {
        this.tempsAlloue = tempsAlloue;
        this.debutDePartie = Date.now();
    }

    public estMultijoueur(): boolean {
        return (this.joueurs.length > 1) ? true : false;
    }

    public obtenirTempsRestantMilisecondes(): number {
        return ((Date.now() - this.debutDePartie) < 0) ? undefined : (Date.now() - this.debutDePartie);
    }

    public obtenirIndicesGrille(): Indice[] {
        return this.grille.motsComplet.recupererIndices();
    }

    public obtenirTypePartie(): TypePartie {
        return this.type;
    }

    public obtenirGrilleComplete(): Grille {
        return this.grille;
    }

    public partieEstTermineAvecCompteur(): boolean {
        if (this.partieEstTermine()) {
            return true;
        }

        if ((Date.now() - this.debutDePartie) >= this.tempsAlloue) {
            return true;
        }

        return false;
    }

    public estLeMot(caseDebut: Case, caseFin: Case, motAVerifier: string, guidJoueur: string): boolean {
        let joueur: Joueur;
        const emplacementMotAChercher: EmplacementMot = this.grille.obtenirEmplacementMot(caseDebut, caseFin);

        if (this.grille.verifierMot(motAVerifier, caseDebut, caseFin)) {
            joueur = this.obtenirJoueur(guidJoueur);

            joueur.aTrouveMot(emplacementMotAChercher, motAVerifier);

            return true;
        }

        return false;
    }

    public obtenirJoueurs(): Joueur[] {
        return this.joueurs;
    }

    private obtenirJoueur(guidJoueur: string): Joueur {
        for (const joueur of this.joueurs) {
            if (joueur.obtenirGuid() === guidJoueur) {
                return joueur;
            }
        }

        return undefined;
    }

    public obtenirNiveauGrille(): Niveau {
        return this.grille.niveau;
    }

    public obtenirJoueurHote(): Joueur {
        return this.joueurs[0];
    }

    public obtenirPartieGuid(): string {
        return this.guid;
    }

    public obtenirMotsTrouve(): Object {
        const motsTrouveSelonJoueur: Object = new Object();

        for (const joueurCourant of this.joueurs) {
            motsTrouveSelonJoueur[joueurCourant.obtenirGuid()] = joueurCourant.obtenirMotTrouve();
        }

        return motsTrouveSelonJoueur;
    }

    public ajouterJoueur(joueur: Joueur): void {
        if (this.joueurs.length <= LIMITE_JOUEURS) {
            this.joueurs.push(joueur);
        }
    }

    public obtenirAdversaire(guidJoueur: string): Joueur[] {
        const adversaires: Joueur[] = new Array();

        for (const joueurCourant of this.joueurs) {
            if (joueurCourant.obtenirGuid() !== guidJoueur) {
                adversaires.push(joueurCourant);
            }
        }

        return adversaires;
    }

    public partieEstTermine(): boolean {
        let totalPointage = 0;

        for (const joueur of this.joueurs) {
            totalPointage += joueur.obtenirPointage();
        }
        if (totalPointage >= this.grille.obtenirEmplacementsMot().length) {
            return true;
        }

        return false;
    }

    public obtenirEmplacementMotSelectionnerJoueur(guidJoueur: string): EmplacementMot {
        return this.obtenirJoueur(guidJoueur).obtenirEmplacementMotSelectionner();
    }

    public changerSelectionMot(guidJoueur: string, emplacementMotSelectionner: EmplacementMot) {
        // Comme l'emplacement mot vient d'ailleurs, on doit le référencer dans notre grille en mémoire.
        const emplacementMotDansGrille: EmplacementMot = this.grille.ObtenirEmplacementMotSelonEmplacementMot(emplacementMotSelectionner);
        const joueur: Joueur = this.obtenirJoueur(guidJoueur);

        this.nePlusSelectionnerMot(joueur);
        this.selectionnerMot(joueur, emplacementMotDansGrille);
    }

    private selectionnerMot(joueur: Joueur, emplacementMotSelectionner: EmplacementMot) {
        joueur.selectionnerEmplacementMot(emplacementMotSelectionner);
        emplacementMotSelectionner.selectionnerEmplacementMot();
    }

    private nePlusSelectionnerMot(joueur: Joueur) {
        const emplacementANePlusSelectionner: EmplacementMot = joueur.obtenirEmplacementMotSelectionner();

        if (emplacementANePlusSelectionner !== undefined) {
            emplacementANePlusSelectionner.nePlusSelectionnerEmplacementMot();
        }

        joueur.nePlusSelectionnerEmplacementMot();
    }

    public obtenirGrille(): Grille {
        return this.grille;
    }
}
