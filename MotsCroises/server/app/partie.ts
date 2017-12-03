import { RequisPourMotAVerifier } from './../../commun/requis/RequisPourMotAVerifier';
import {Joueur} from '../../commun/Joueur';
import {Grille} from './grille';
import {Guid} from '../../commun/Guid';
import {TypePartie} from '../../commun/TypePartie';
import {EmplacementMot} from '../../commun/EmplacementMot';
import {Niveau} from '../../commun/Niveau';
import {Indice} from './indice';

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
        return ((Date.now() - this.debutDePartie) < 0) ? undefined : (this.debutDePartie + this.tempsAlloue - Date.now());
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

    public estLeMot(requisPourMotAVerifier: RequisPourMotAVerifier): boolean {
        let joueur: Joueur;
        const emplacementMotAChercher: EmplacementMot = this.grille.emplacementsMots.obtenirEmplacementMot(
                                                                            requisPourMotAVerifier.emplacementMot.obtenirCaseDebut(),
                                                                            requisPourMotAVerifier.emplacementMot.obtenirCaseFin());
        if (this.grille.verifierMot(requisPourMotAVerifier)) {
            joueur = this.obtenirJoueur(requisPourMotAVerifier.guidJoueur);

            joueur.aTrouveMot(emplacementMotAChercher, requisPourMotAVerifier.motAVerifier);

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
        const emplacementMotDansGrille: EmplacementMot =
                        this.grille.emplacementsMots.ObtenirEmplacementMotSelonEmplacementMot(emplacementMotSelectionner);
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
