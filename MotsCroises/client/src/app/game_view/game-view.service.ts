import { RequisPourMotsComplets } from './../../../../commun/requis/RequisPourMotsComplets';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import {IndiceMot} from '../indice/indiceMot';
import {ConnexionTempsReelClient} from '../ConnexionTempsReelClient';
import {COULEUR_BLEUE, Joueur} from '../../../../commun/Joueur';
import {Niveau} from '../../../../commun/Niveau';
import {TypePartie} from '../../../../commun/TypePartie';
import {RequisPourMotAVerifier} from '../../../../commun/requis/RequisPourMotAVerifier';
import * as requetes from '../../../../commun/constantes/RequetesTempsReel';
import {Indice} from '../../../../server/app/Indice';
import {EmplacementMot} from '../../../../commun/EmplacementMot';
import {Router} from '@angular/router';
import {RequisDemandeListePartieEnAttente} from '../../../../commun/requis/RequisDemandeListePartieEnAttente';
import {VuePartieEnCours} from '../../../../commun/VuePartieEnCours';
import {RequisPourJoindrePartieMultijoueur} from '../../../../commun/requis/RequisPourJoindrePartieMultijoueur';
import {RequisPourSelectionnerMot} from '../../../../commun/requis/RequisPourSelectionnerMot';
import {RequisPourObtenirTempsRestant} from "../../../../commun/requis/RequisPourObtenirTempsRestant";


@Injectable()
export class GameViewService {
  private motTrouve = new Subject<string>();
  public motTrouve$ = this.motTrouve.asObservable();
  private modifierTempsRestant = new Subject<number>();
  public modifierTempsRestant$ = this.modifierTempsRestant.asObservable();
  private partieTeminee = new Subject<string>();
  public partieTeminee$ = this.partieTeminee.asObservable();
  private joueurAdverseTrouve = new Subject<string>();
  public joueurAdverseTrouve$ = this.joueurAdverseTrouve.asObservable();
  private indiceSelectionne = new Subject<IndiceMot>();
  public indiceSelectionne$ = this.indiceSelectionne.asObservable();
  private indiceAdversaireSelectionne = new Subject<IndiceMot>();
  public indiceAdversaireSelectionne$ = this.indiceAdversaireSelectionne.asObservable();
  private motEcrit = new Subject<string>();
  public motEcrit$ = this.motEcrit.asObservable();
  private partieGeneree: SpecificationPartie;
  public indices: IndiceMot[];
  public connexionTempsReelClient: ConnexionTempsReelClient;
  public specificationPartie: SpecificationPartie;
  public requisDemandeListePartieEnCours = new RequisDemandeListePartieEnAttente();
  public joueur: Joueur = new Joueur();
  public joueur2: Joueur = new Joueur(COULEUR_BLEUE, '');
  private indiceTeste: IndiceMot;
  private indiceAdversaire: IndiceMot;
  private motEntre: string;
  private niveauPartie: Niveau;
  private typePartie: TypePartie;
  private nbJoueursPartie: number;
  private requisPourJoindrePartieMultijoueur: RequisPourJoindrePartieMultijoueur;
  private requisPourSelectionnerMot: RequisPourSelectionnerMot;
  private requisPourObtenirTempsRestant: RequisPourObtenirTempsRestant;
  private emplacementMot: EmplacementMot;

  private listeVuePartie: VuePartieEnCours[] = new Array;

  constructor(private router: Router) {
  }


  public mettreAJourGrilleGeneree(specificationPartie: SpecificationPartie): void {
    this.partieGeneree = specificationPartie;
    this.MAJIndices(this.partieGeneree);
  }

  public mettreAJourIndice(indices: IndiceMot[]): void {
    this.indices = indices;
  }

  public getPartie(): SpecificationPartie {
    return this.partieGeneree;
  }

  private MAJIndices(specificationPartie: SpecificationPartie): void {
    const indices: IndiceMot[] = new Array();

    for (const emplacementMot of this.partieGeneree.specificationGrilleEnCours.emplacementMots) {
      const indiceServeur: Indice = this.trouverIndiceAvecGuid(emplacementMot.obtenirGuidIndice());
      const definition = indiceServeur.definitions[0];
      indices.push(new IndiceMot(emplacementMot.obtenirGuidIndice(), emplacementMot.obtenirIndexFixe() + 1,
        definition, emplacementMot.obtenirGrandeur(), emplacementMot.obtenirPosition(),
        emplacementMot.obtenirCaseDebut().obtenirNumeroColonne() + 1,
        emplacementMot.obtenirCaseDebut().obtenirNumeroLigne() + 1, ''));
    }
    this.indices = indices;
  }

  private trouverIndiceAvecGuid(guid: string): Indice {
    for (const indiceServeur of this.partieGeneree.indices) {
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
    for (const emplacementMot of this.partieGeneree.specificationGrilleEnCours.emplacementMots) {
      if (emplacementMot.obtenirGuidIndice() === guid) {
        return emplacementMot;
      }
    }
    return null;
  }

  public testMotEntre(motAtester: string, indice: IndiceMot): void {
    this.indiceTeste = indice;
    this.motEntre = motAtester;
    this.emplacementMot = this.trouverEmplacementMotAvecGuid(indice.guidIndice);
    this.demanderVerificationMot(this.emplacementMot, motAtester);
  }

  public initialiserConnexion(): void {
    this.connexionTempsReelClient = new ConnexionTempsReelClient();
  }

  public demanderPartie(niveau: Niveau, typePartie: TypePartie, nbJoueursPartie: number): void {
    this.nbJoueursPartie = nbJoueursPartie;
    this.niveauPartie = niveau;
    this.typePartie = typePartie;
    this.specificationPartie = new SpecificationPartie(niveau, this.joueur, typePartie);
    if (this.nbJoueursPartie === 0) {
      this.demanderPartieServer();
    } else {
      if (this.demanderNomJoueur()) {
        this.demanderPartieServer();
      }
    }
  }

  public demanderPartieServer() {
    switch (this.nbJoueursPartie) {
      case 0 :
        this.connexionTempsReelClient.envoyerRecevoirRequete<SpecificationPartie>(requetes.REQUETE_SERVEUR_CREER_PARTIE_SOLO,
          this.specificationPartie, requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, this.recupererPartie, this);
        break;

      case 1 :
        this.connexionTempsReelClient.envoyerRecevoirRequete<SpecificationPartie>(requetes.REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR,
          this.specificationPartie, requetes.REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR_RAPPEL, this.recupererPartie, this);
        this.ecouterRetourRejoindrePartieMultijoueur();
        break;
    }

    this.connexionTempsReelClient.ecouterRequete(requetes.REQUETE_CLIENT_PARTIE_TERMINE, this.messagePartieTerminee, this);
  }

  public demanderTempsPartie(): void {
    // Demander liste de partie.
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

  public demanderListePartieEnAttente(listeVuePartie: VuePartieEnCours[]): void {
    this.listeVuePartie = listeVuePartie;

    // Demander liste de partie.
    this.connexionTempsReelClient.envoyerRecevoirRequete<RequisDemandeListePartieEnAttente>(
      requetes.REQUETE_SERVEUR_DEMANDE_LISTE_PARTIES_EN_COURS,
      this.requisDemandeListePartieEnCours, requetes.REQUETE_CLIENT_DEMANDE_LISTE_PARTIES_EN_COURS_RAPPEL,
      this.rappelDemanderListePartieEnAttente, this);
  }

  public rejoindrePartieMultijoueur(partieChoisie: VuePartieEnCours, joueurAJoindre: Joueur): void {
    this.requisPourJoindrePartieMultijoueur = new RequisPourJoindrePartieMultijoueur(partieChoisie.guidPartie, joueurAJoindre);
    this.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourJoindrePartieMultijoueur>(
      requetes.REQUETE_SERVEUR_JOINDRE_PARTIE,
      this.requisPourJoindrePartieMultijoueur, requetes.REQUETE_SERVEUR_JOINDRE_PARTIE_RAPPEL,
      this.rappelRejoindrePartieMultijoueur, this);
  }

  public ecouterRetourRejoindrePartieMultijoueur<RequisDemandeListePartieEnAttente>(): void {
    this.connexionTempsReelClient.ecouterRequete(
      requetes.REQUETE_SERVEUR_JOINDRE_PARTIE_RAPPEL, this.rappelRejoindrePartieMultijoueur, this
    );
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
    console.log('retour changement mot');
    self.requisPourSelectionnerMot = RequisPourSelectionnerMot.rehydrater(requisPourSelectionnerMot);
    self.indiceAdversaire = self.trouverIndiceMotAvecGuid(requisPourSelectionnerMot.emplacementMot.GuidIndice);
    console.log('indice ' + self.indiceAdversaire.guidIndice + ' de valeur ' + self.indiceAdversaire.definition + 'trouvé');
    self.mettreAJourSelectionAdversaire(self.indiceAdversaire);

  }

  public rappelRejoindrePartieMultijoueur(requisPourJoindrePartieMultijoueur: RequisPourJoindrePartieMultijoueur
    , self: GameViewService): void {
    requisPourJoindrePartieMultijoueur = RequisPourJoindrePartieMultijoueur.rehydrater(requisPourJoindrePartieMultijoueur);
    /*console.log('JOUEUR A Rejoins LA PARTIE : ' + requisPourJoindrePartieMultijoueur.guidPartie);
    console.log(requisPourJoindrePartieMultijoueur.joueurs);
    console.log(requisPourJoindrePartieMultijoueur.joueurAAjouter);
    self.joueur2 = this.requisPourJoindrePartieMultijoueur.joueurAAjouter;*/

    for (const joueurCourant of requisPourJoindrePartieMultijoueur.joueurs) {
      if (joueurCourant.obtenirGuid() !== self.joueur.obtenirGuid()) {
        self.joueur2 = joueurCourant;
      }
      console.log('NOM JOUEUR: ' + joueurCourant.obtenirNomJoueur());
    }

    self.demarrerPartieMultijoueur(requisPourJoindrePartieMultijoueur.specificationPartie, self);
    // self.recupererPartie(this.requisPourJoindrePartieMultijoueur.specificationPartie, self);
  }

  public rappelDemanderListePartieEnAttente(requisDemandeListePartieEnCours: RequisDemandeListePartieEnAttente, self: GameViewService) {
    console.log('RETOUR Rappel DEMANDER : ' + requisDemandeListePartieEnCours.listePartie.length);
    for (const vuePartieCourante of requisDemandeListePartieEnCours.listePartie) {
      console.log(vuePartieCourante.nomJoueurHote + ' | ' + vuePartieCourante.guidPartie);
      self.listeVuePartie.push(vuePartieCourante);
    }
  }

  public recommencerPartie() {
    this.demanderPartieServer();
  }

  public recupererPartie(specificationPartie: SpecificationPartie, self: GameViewService): void {
    self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
    self.mettreAJourGrilleGeneree(self.specificationPartie);
    self.partieCreeeRedirection();
  }

  public partieCreeeRedirection() {
    if (this.nbJoueursPartie === 0) {
      this.afficherPartie(this.typePartie, this.niveauPartie, this.nbJoueursPartie);
    } else {
      this.router.navigate(['/attentePartie']);
    }
  }

  /*  public recupererPartieMultijoueur(specificationPartie: SpecificationPartie, self: GameViewService): void {
      self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
      console.log(specificationPartie.guidPartie + ' | ' + 'PARTIE CRÉÉ MULTI');
    }*/

  public demarrerPartieMultijoueur(specificationPartie: SpecificationPartie, self: GameViewService): void {
    self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
    self.mettreAJourGrilleGeneree(self.specificationPartie);
    self.nbJoueursPartie = 1;
    self.ecouterRetourMot();
    self.router.navigate([self.obtenirRoutePartie()]);
    console.log(specificationPartie.guidPartie + ' | ' + 'PARTIE CRÉÉ MULTI');
    self.ecouterChangementSelectionMotAdversaire();
  }

  public obtenirRoutePartie(): string {
    return '/partie/' + this.specificationPartie.typePartie + '/' + this.specificationPartie.niveau + '/' + this.nbJoueursPartie;
  }

  public demanderVerificationMot(emplacementMot: EmplacementMot, motAtester: string): void {
    console.log('demande Verif mot');
    const requisPourMotAVerifier: RequisPourMotAVerifier = new RequisPourMotAVerifier(
      emplacementMot, motAtester, this.joueur.obtenirGuid(), this.specificationPartie.guidPartie);
    this.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourMotAVerifier>(requetes.REQUETE_SERVEUR_VERIFIER_MOT,
      requisPourMotAVerifier, requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, this.recupererVerificationMot, this);
  }

  public recupererVerificationMot(requisPourMotAVerifier: RequisPourMotAVerifier, self: GameViewService): void {
    console.log(requisPourMotAVerifier);
    console.log('GUID partie', self.specificationPartie.guidPartie);
    if (requisPourMotAVerifier.guidPartie !== self.specificationPartie.guidPartie) {
      return;
    }
    if (requisPourMotAVerifier.estLeMot) {
      // self.indiceTeste.motTrouve = self.motEntre;

      console.log('joueurs guid ', requisPourMotAVerifier.guidJoueur, '  :', self.joueur.obtenirGuid());
      const indiceMotTrouve: IndiceMot = self.trouverIndiceMotAvecGuid(requisPourMotAVerifier.emplacementMot.GuidIndice);
      if (requisPourMotAVerifier.guidJoueur === self.joueur.obtenirGuid()) {
        console.log('joueur 1 a trouvé');
        self.joueur.aTrouveMot(requisPourMotAVerifier.emplacementMot, requisPourMotAVerifier.motAVerifier);
        indiceMotTrouve.modifierCouleurMot(self.joueur.obtenirCouleur());
      } else {
        console.log('joueur 2 a trouvé');
        self.joueur2.aTrouveMot(requisPourMotAVerifier.emplacementMot, requisPourMotAVerifier.motAVerifier);
        indiceMotTrouve.modifierCouleurMot(COULEUR_BLEUE);
      }
      console.log(self.trouverIndiceMotAvecGuid(requisPourMotAVerifier.emplacementMot.GuidIndice));
      indiceMotTrouve.motTrouve = requisPourMotAVerifier.motAVerifier;
      self.motTrouve.next();
    } else if (requisPourMotAVerifier.guidJoueur === self.joueur.obtenirGuid()) {
      alert('Malheureusement, ce n\'est pas le bon mot.');
    }
  }

  public messagePartieTerminee(partieTermineeBoolean: boolean, self: GameViewService) {
    if (partieTermineeBoolean) {
      self.partieTeminee.next();
      alert('tous les mots ont été trouvés, partie terminée');
    }
  }

  public partieTermineeFauteDeTemps(partieTermineeBoolean: boolean) {
    if (partieTermineeBoolean) {
      this.partieTeminee.next();
      alert('Le temps imparti est écoulé, fin de la partie');
    }
  }

  private afficherPartie(typePartie: TypePartie, niveauPartie: Niveau, nbJoueursPartie) {
    if (this.nbJoueursPartie === 1) {
      this.demanderNomJoueur();
    } else {
      this.router.navigate(['/partie/' + typePartie + '/' + niveauPartie + '/' + nbJoueursPartie]);
    }
  }

  private demanderNomJoueur(): boolean {
    const playerName = prompt('Please enter your name:', '');
    if (playerName !== null && playerName !== '') {
      this.joueur.changerNomJoueur(playerName);
      return true;
    }
    return false;
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

  public attentePartieDeuxJoueurs() {

  }

  public afficherSelectionIndice(indice: IndiceMot) {
    if (indice){
      this.emplacementMot = this.trouverEmplacementMotAvecGuid(indice.guidIndice);
      this.indiceSelectionne.next(indice);
    }
    this.changementSelectionMot();
  }

  public mettreAJourMotEntre(motEntre: string) {
    this.motEcrit.next(motEntre);
  }

  public mettreAJourSelectionAdversaire(indice: IndiceMot) {
    this.indiceAdversaireSelectionne.next(indice);

  }

  public selectionIndice() {

  }
}
