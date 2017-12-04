import {RequisPourMotsComplets} from '../../../../commun/requis/RequisPourMotsComplets';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import {IndiceMot} from '../indice/indiceMot';
import {ConnexionTempsReelClient} from '../connestion_temps_reel/ConnexionTempsReelClient';
import {COULEUR_JOUEUR1, COULEUR_JOUEUR2, Joueur} from '../../../../commun/Joueur';
import {RequisPourMotAVerifier} from '../../../../commun/requis/RequisPourMotAVerifier';
import * as requetes from '../../../../commun/constantes/RequetesTempsReel';
import {Indice} from '../../../../server/app/Indice';
import {EmplacementMot} from '../../../../commun/EmplacementMot';
import {VuePartieEnCours} from '../../../../commun/VuePartieEnCours';
import {RequisPourSelectionnerMot} from '../../../../commun/requis/RequisPourSelectionnerMot';
import {RequisPourObtenirTempsRestant} from '../../../../commun/requis/RequisPourObtenirTempsRestant';
import {RequisPourModifierTempsRestant} from '../../../../commun/requis/RequisPourModifierTempsRestant';

const TOUS_LES_MOTS_ONT_ETE_TROUVES = 'tous les mots ont été trouvés, partie terminée';
const TEMPS_ECOULE = 'Le temps imparti est écoulé, fin de la partie';
const PAS_DE_DEFINITION = 'No definition';
const MAUVAIS_MOT = 'Malheureusement, ce n\'est pas le bon mot.';

@Injectable()
export class GameViewService {
    private motTrouve = new Subject<string>();
    private modifierTempsRestant = new Subject<number>();
    private partieTeminee = new Subject<string>();
    private modificationTemps = new Subject<string>();
    private indiceSelectionne = new Subject<IndiceMot>();
    private indiceAdversaireSelectionne = new Subject<IndiceMot>();
    private motEcrit = new Subject<string>();
    private indiceAdversaire: IndiceMot;
    private nbJoueursPartie: number;
    private requisPourSelectionnerMot: RequisPourSelectionnerMot;
    private requisPourObtenirTempsRestant: RequisPourObtenirTempsRestant;
    private emplacementMot: EmplacementMot;
    public listeVuePartie: VuePartieEnCours[] = [];

    public motTrouve$ = this.motTrouve.asObservable();
    public modifierTempsRestant$ = this.modifierTempsRestant.asObservable();
    public partieTeminee$ = this.partieTeminee.asObservable();
    public modificationTemps$ = this.partieTeminee.asObservable();
    public indiceSelectionne$ = this.indiceSelectionne.asObservable();
    public indiceAdversaireSelectionne$ = this.indiceAdversaireSelectionne.asObservable();
    public motEcrit$ = this.motEcrit.asObservable();
    public indices: IndiceMot[];
    public connexionTempsReelClient: ConnexionTempsReelClient;
    public specificationPartie: SpecificationPartie;
    public joueur: Joueur = new Joueur(COULEUR_JOUEUR1);
    public joueur2: Joueur = new Joueur(COULEUR_JOUEUR2, '');
    public modificationTempsServeurEnCours = false;

    constructor() {
        this.initialiserConnexion();
    }

    public initialiserConnexion(): void {
        this.connexionTempsReelClient = new ConnexionTempsReelClient();
    }

    public getPartie(): SpecificationPartie {
        return this.specificationPartie;
    }

    public MAJIndices(): void {
        const indices: IndiceMot[] = [];
        for (const emplacementMot of this.specificationPartie.specificationGrilleEnCours.emplacementMots) {
            const indiceServeur: Indice = this.trouverIndiceAvecGuid(emplacementMot.obtenirGuidIndice());
            let definition: string;
            if (indiceServeur.definitions !== undefined) {
                definition = indiceServeur.definitions[0];
            } else {
                definition = PAS_DE_DEFINITION;
            }
            indices.push(new IndiceMot(emplacementMot, definition));
        }
        this.indices = indices;
    }

    private trouverIndiceAvecGuid(guid: string): Indice {
        for (const indiceServeur of this.specificationPartie.indices) {
            if (indiceServeur.id === guid) {
                return indiceServeur;
            }
        }
        return null;
    }

    private trouverIndiceMotAvecGuid(guid: string): IndiceMot {
        for (const indiceMot of this.indices) {
            if (indiceMot.guidIndice === guid) {
                return indiceMot;
            }
        }
        return null;
    }

    private trouverEmplacementMotAvecGuid(guid: string): EmplacementMot {
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

    public changementSelectionMot(): void {
        this.requisPourSelectionnerMot = new RequisPourSelectionnerMot(this.emplacementMot,
            this.joueur.obtenirGuid(), this.specificationPartie.guidPartie);
        this.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourSelectionnerMot>(
            requetes.REQUETE_SERVEUR_CHANGER_EMPLACEMENT_MOT_SELECTIONNER,
            this.requisPourSelectionnerMot, requetes.REQUETE_CLIENT_ADVERSAIRE_CHANGER_EMPLACEMENT_MOT_SELECTIONNER,
            this.rappelChangementSelectionIndiceAdversaire, this);
    }

    public ecouterChangementSelectionMotAdversaire<RequisPourSelectionnerMot>(): void {
        this.connexionTempsReelClient.ecouterRequete<RequisPourSelectionnerMot>(
            requetes.REQUETE_CLIENT_ADVERSAIRE_CHANGER_EMPLACEMENT_MOT_SELECTIONNER, this.rappelChangementSelectionIndiceAdversaire, this
        );
    }

    public ecouterRetourMot<RequisPourMotAVerifier>(): void {
        this.connexionTempsReelClient.ecouterRequete<RequisPourMotAVerifier>
        (requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, this.recupererVerificationMot, this);
    }

    private rappelChangementSelectionIndiceAdversaire(requisPourSelectionnerMot: RequisPourSelectionnerMot, self: GameViewService) {
        self.requisPourSelectionnerMot = RequisPourSelectionnerMot.rehydrater(requisPourSelectionnerMot);
        self.indiceAdversaire = self.trouverIndiceMotAvecGuid(requisPourSelectionnerMot.emplacementMot.GuidIndice);
        self.mettreAJourSelectionAdversaire(self.indiceAdversaire);
    }

    public recommencerPartie() {
        // this.demanderPartieServer();
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
            const indiceMotTrouve: IndiceMot = self.trouverIndiceMotAvecGuid(requisPourMotAVerifier.emplacementMot.GuidIndice);
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

    public ecouterSiPartieTerminee() {
        this.connexionTempsReelClient.ecouterRequete(requetes.REQUETE_CLIENT_PARTIE_TERMINE, this.messagePartieTerminee, this);
    }

    public ecouterRappelsServeur() {
        if (this.nbJoueursPartie > 0) {
            this.ecouterChangementSelectionMotAdversaire();
        }
        this.ecouterRetourMot();
        this.ecouterSiPartieTerminee();
    }

    public messagePartieTerminee(partieTermineeBoolean: boolean, message: string = TOUS_LES_MOTS_ONT_ETE_TROUVES, self: GameViewService) {
        if (partieTermineeBoolean) {
            self.partieTeminee.next();
            alert(message);
        }
    }

    public partieTermineeFauteDeTemps() {
        this.messagePartieTerminee(true, TEMPS_ECOULE, this);
    }

    public demanderMotsComplets() {
        const requisPourMotsComplets = new RequisPourMotsComplets(this.specificationPartie.guidPartie);
        this.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourMotsComplets>(requetes.REQUETE_SERVER_OBTENIR_MOTS_COMPLETS_CHEAT_MODE,
            requisPourMotsComplets, requetes.REQUETE_CLIENT_RAPPEL_OBTENIR_MOTS_COMPLETS_CHEAT_MODE, this.recevoirMotsComplets, this);
    }

    public recevoirMotsComplets(requisPourMotsComplets: RequisPourMotsComplets, self: GameViewService) {
        for (let i = 0; i < self.indices.length; i++) {
            self.indices[i].definition = requisPourMotsComplets.listeMotComplet[i].lettres;
        }
    }

    public afficherSelectionIndice(indice: IndiceMot) {
        if (indice) {
            this.emplacementMot = this.trouverEmplacementMotAvecGuid(indice.guidIndice);
            this.indiceSelectionne.next(indice);
        } else {
            this.emplacementMot = null;
            this.indiceSelectionne.next();
        }
        this.changementSelectionMot();
    }

    public mettreAJourMotEntre(motEntre: string) {
        this.motEcrit.next(motEntre);
    }

    public mettreAJourSelectionAdversaire(indice: IndiceMot) {
        this.indiceAdversaireSelectionne.next(indice);
    }

    // ****************** Gestion temps de partie ************** //

    public activerModificationTempsServeur(): void {
        this.modificationTempsServeurEnCours = true;
        this.modificationTemps.next();
    }

    public desactiverModificationTempsServeur(): void {
        this.modificationTempsServeurEnCours = false;
    }

    public modifierTempsServeur(tempsVoulu: number) {
        const requisPourModifierTempsRestant = new RequisPourModifierTempsRestant(this.specificationPartie.guidPartie, tempsVoulu);
        this.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourModifierTempsRestant>(requetes.REQUETE_SERVEUR_MODIFIER_TEMPS_RESTANT,
            requisPourModifierTempsRestant, requetes.REQUETE_CLIENT_MODIFIER_TEMPS_RESTANT_RAPPEL, this.mettreAJourTempsPartie, this);
    }

    public demanderTempsPartie(): void {
        this.requisPourObtenirTempsRestant = new RequisPourObtenirTempsRestant(this.specificationPartie.guidPartie);
        this.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourObtenirTempsRestant>(
            requetes.REQUETE_SERVEUR_OBTENIR_TEMPS_RESTANT,
            this.requisPourObtenirTempsRestant, requetes.REQUETE_CLIENT_OBTENIR_TEMPS_RESTANT_RAPPEL,
            this.mettreAJourTempsPartie, this);
    }

    public mettreAJourTempsPartie(requisPourObtenirTempsRestant: RequisPourObtenirTempsRestant,
                                  self: GameViewService): void {
        self.modifierTempsRestant.next(requisPourObtenirTempsRestant.tempsRestant);
    }
}
