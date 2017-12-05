import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { SpecificationPartie } from '../../../../commun/specificationPartie';
import { IndiceMot } from '../indice/indiceMot';
import { ConnexionTempsReelClient } from '../connexion_temps_reel/connexionTempsReelClient';
import { COULEUR_JOUEUR1, COULEUR_JOUEUR2, Joueur } from '../../../../commun/joueur';
import { RequisPourMotAVerifier } from '../../../../commun/requis/requisPourMotAVerifier';
import * as requetes from '../../../../commun/constantes/requetesTempsReel';
import { EmplacementMot } from '../../../../commun/emplacementMot';
import { VuePartieEnCours } from '../../../../commun/vuePartieEnCours';
import { ConnexionTempsReelClientService } from '../connexion_temps_reel/connexionTempsReelClientService';
import { ChoixPartieService } from '../choix_partie/choix-partie.service';

const TOUS_LES_MOTS_ONT_ETE_TROUVES = 'tous les mots ont été trouvés, partie terminée';
const TEMPS_ECOULE = 'Le temps imparti est écoulé, fin de la partie';
const MAUVAIS_MOT = 'Malheureusement, ce n\'est pas le bon mot.';

@Injectable()
export class GameViewService {
    public indices: IndiceMot[];
    public emplacementMot: EmplacementMot;
    public listeVuePartie: VuePartieEnCours[] = [];
    public connexionTempsReelClient: ConnexionTempsReelClient;
    public specificationPartie: SpecificationPartie;
    public joueur: Joueur = new Joueur(COULEUR_JOUEUR1);
    public joueur2: Joueur = new Joueur(COULEUR_JOUEUR2, '');
    private motTrouve = new Subject<string>();
    public motTrouve$ = this.motTrouve.asObservable();
    private partieTeminee = new Subject<string>();
    public partieTeminee$ = this.partieTeminee.asObservable();
    private motEcrit = new Subject<string>();
    public motEcrit$ = this.motEcrit.asObservable();

    constructor(private connextionTempsReelClientService: ConnexionTempsReelClientService, private choixPartieService: ChoixPartieService) {
        this.initialiserConnexion();
    }

    public initialiserConnexion(): void {
        this.connexionTempsReelClient = this.connextionTempsReelClientService.connexionTempsReelClient;
    }

    public getPartie(): SpecificationPartie {
        return this.specificationPartie;
    }

    public trouverIndiceMotAvecGuid(guid: string, listeIndice: IndiceMot[]): IndiceMot {
        for (const indiceMot of listeIndice) {
            if (indiceMot.guidIndice === guid) {
                return indiceMot;
            }
        }
        return null;
    }

    public trouverEmplacementMotAvecGuid(guid: string): EmplacementMot {
        for (const emplacementMot of this.specificationPartie.specificationGrilleEnCours.emplacementMots) {
            if (emplacementMot.obtenirGuidIndice() === guid) {
                return emplacementMot;
            }
        }
        return null;
    }

    public testMotEntre(motAtester: string, indice: IndiceMot): void {
        this.emplacementMot = this.trouverEmplacementMotAvecGuid(indice.guidIndice);
        this.demanderVerificationMot(this.emplacementMot, motAtester);
    }

    public ecouterRetourMot<RequisPourMotAVerifier>(): void {
        this.connexionTempsReelClient.ecouterRequete<RequisPourMotAVerifier>
        (requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, this.recupererVerificationMot, this);
    }

    public recommencerPartie() {
        this.choixPartieService.demanderPartieServer();
    }

    public demanderVerificationMot(emplacementMot: EmplacementMot, motAtester: string): void {
        const requisPourMotAVerifier: RequisPourMotAVerifier = new RequisPourMotAVerifier(
            emplacementMot, motAtester, this.joueur.obtenirGuid(), this.specificationPartie.guidPartie);
        this.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourMotAVerifier>(requetes.REQUETE_SERVEUR_VERIFIER_MOT,
            requisPourMotAVerifier, requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, this.recupererVerificationMot, this);
    }

    public recupererVerificationMot(requisPourMotAVerifier: RequisPourMotAVerifier, self: GameViewService): void {
        if (requisPourMotAVerifier.guidPartie !== self.specificationPartie.guidPartie) {
            return;
        }
        if (requisPourMotAVerifier.estLeMot) {
            const indiceMotTrouve: IndiceMot = self.trouverIndiceMotAvecGuid(
                                                                            requisPourMotAVerifier.emplacementMot.GuidIndice,
                                                                            self.indices);
            if (requisPourMotAVerifier.guidJoueur === self.joueur.obtenirGuid()) {
                self.joueur.aTrouveMot(requisPourMotAVerifier.emplacementMot, requisPourMotAVerifier.motAVerifier);
                indiceMotTrouve.modifierCouleurMot(self.joueur.obtenirCouleur());
            } else {
                self.joueur2.aTrouveMot(requisPourMotAVerifier.emplacementMot, requisPourMotAVerifier.motAVerifier);
                indiceMotTrouve.modifierCouleurMot(self.joueur2.obtenirCouleur());
            }
            indiceMotTrouve.motTrouve = requisPourMotAVerifier.motAVerifier;
            self.motTrouve.next();
        } else if (requisPourMotAVerifier.guidJoueur === self.joueur.obtenirGuid()) {
            alert(MAUVAIS_MOT);
        }
    }

    public ecouterSiPartieTerminee(): void {
        this.connexionTempsReelClient.ecouterRequete(requetes.REQUETE_CLIENT_PARTIE_TERMINE, this.messagePartieTerminee, this);
    }

    public ecouterRappelsServeur(): void {
        this.ecouterRetourMot();
        this.ecouterSiPartieTerminee();
    }

    public messagePartieTerminee(partieTermineeBoolean: boolean, self: GameViewService, message: string = TOUS_LES_MOTS_ONT_ETE_TROUVES) {
        if (partieTermineeBoolean) {
            self.partieTeminee.next();
            alert(message);
        }
    }

    public partieTermineeFauteDeTemps() {
        this.messagePartieTerminee(true, this, TEMPS_ECOULE);
    }

    public mettreAJourMotEntre(motEntre: string) {
        this.motEcrit.next(motEntre);
    }
}
