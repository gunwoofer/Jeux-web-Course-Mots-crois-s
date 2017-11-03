import { RequisPourMotsComplets } from './../../../../commun/requis/RequisPourMotsComplets';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import {IndiceMot} from '../indice/indiceMot';
import {ConnexionTempsReelClient} from '../ConnexionTempsReelClient';
import {Joueur} from '../../../../commun/Joueur';
import {Niveau} from '../../../../commun/Niveau';
import {TypePartie} from '../../../../commun/TypePartie';
import {RequisPourMotAVerifier} from '../../../../commun/requis/RequisPourMotAVerifier';
import * as requetes from '../../../../commun/constantes/RequetesTempsReel';
import {Indice} from '../../../../server/app/Indice';
import {EmplacementMot} from '../../../../commun/EmplacementMot';
import {Router} from '@angular/router';
import {RequisDemandeListePartieEnAttente} from '../../../../commun/requis/RequisDemandeListePartieEnAttente';


@Injectable()
export class GameViewService {
  private motTrouveJ1 = new Subject<string>();
  public motTrouveJ1$ = this.motTrouveJ1.asObservable();
  private partieTeminee = new Subject<string>();
  public partieTeminee$ = this.partieTeminee.asObservable();
  private partieGeneree: SpecificationPartie;
  public indices: IndiceMot[];
  public connexionTempsReelClient: ConnexionTempsReelClient;
  public specificationPartie: SpecificationPartie;
  public requisDemandeListePartieEnCours = new RequisDemandeListePartieEnAttente;
  public joueur: Joueur = new Joueur();
  private indiceTeste: IndiceMot;
  private motEntre: string;
  private niveauPartie: Niveau;
  private typePartie: TypePartie;
  private nbJoueursPartie: number;
  joueur1 = new Joueur();

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
    const emplacementMot = this.trouverEmplacementMotAvecGuid(indice.guidIndice);
    this.demanderVerificationMot(emplacementMot, motAtester);
  }

  public initialiserConnexion(): void {
    this.connexionTempsReelClient = new ConnexionTempsReelClient();
  }

  public demanderPartie(niveau: Niveau, typePartie: TypePartie, nbJoueursPartie: number): void {
    this.nbJoueursPartie = nbJoueursPartie;
    this.niveauPartie = niveau;
    this.typePartie = typePartie;
    this.specificationPartie = new SpecificationPartie(niveau, this.joueur, typePartie);
    if (this.nbJoueursPartie === 0 ) {
      this.demanderPartieServer();
    }else {
      this.demanderNomJoueur();
    }
  }

  public demanderPartieServer() {
    this.connexionTempsReelClient.envoyerRecevoirRequete<SpecificationPartie>(requetes.REQUETE_SERVEUR_CREER_PARTIE_SOLO,
      this.specificationPartie, requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, this.recupererPartie, this);
    this.connexionTempsReelClient.ecouterRequete(requetes.REQUETE_CLIENT_PARTIE_TERMINE, this.messagePartieTerminee, this);
  }

  public demanderListePartieEnAttente(): void {
    // Demander liste de partie.
    this.connexionTempsReelClient.envoyerRecevoirRequete<RequisDemandeListePartieEnAttente>(
      requetes.REQUETE_SERVEUR_DEMANDE_LISTE_PARTIES_EN_COURS,
      this.requisDemandeListePartieEnCours, requetes.REQUETE_CLIENT_DEMANDE_LISTE_PARTIES_EN_COURS_RAPPEL,
      this.rappelDemanderListePartieEnAttente, this);
  }

  public rappelDemanderListePartieEnAttente(requisDemandeListePartieEnCours: RequisDemandeListePartieEnAttente, self: GameViewService) {
    for (const vuePartieCourante of requisDemandeListePartieEnCours.listePartie) {
      console.log(vuePartieCourante.nomJoueurHote + ' | ' + vuePartieCourante.guidPartie);
    }
  }

  public recommencerPartie() {
    this.demanderPartieServer();
  }

  public recupererPartie(specificationPartie: SpecificationPartie, self: GameViewService): void {
    self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
    self.mettreAJourGrilleGeneree(self.specificationPartie);
    self.afficherPartie(self.typePartie, self.niveauPartie, self.nbJoueursPartie);
  }

  public demanderVerificationMot(emplacementMot: EmplacementMot, motAtester: string): void {
    const requisPourMotAVerifier: RequisPourMotAVerifier = new RequisPourMotAVerifier(
      emplacementMot, motAtester, this.specificationPartie.joueur.obtenirGuid(), this.specificationPartie.guidPartie);
    this.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourMotAVerifier>(requetes.REQUETE_SERVEUR_VERIFIER_MOT,
      requisPourMotAVerifier, requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, this.recupererVerificationMot, this);
  }

  public recupererVerificationMot(requisPourMotAVerifier: RequisPourMotAVerifier, self: GameViewService): void {
    if (requisPourMotAVerifier.estLeMot) {
      self.indiceTeste.motTrouve = self.motEntre;
      self.motTrouveJ1.next();
    } else {
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

  private demanderNomJoueur() {
    const playerName = prompt('Please enter your name:', '');
    if (playerName !== null && playerName !== '') {
      this.joueur.changerNomJoueur(playerName);
      this.router.navigate(['/attentePartie']);
    }
  }


  public demanderMotsComplets(guid: string) {
    const requisPourMotsComplets = new RequisPourMotsComplets(guid);
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
}
