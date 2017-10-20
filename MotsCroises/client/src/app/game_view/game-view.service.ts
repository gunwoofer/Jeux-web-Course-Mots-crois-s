import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import {IndiceMot} from '../indice/indiceMot';
import {ConnexionTempsReelClient} from '../ConnexionTempsReelClient';
import {Joueur} from '../../../../commun/Joueur';
import {Niveau} from '../../../../commun/Niveau';
import {TypePartie} from '../../../../commun/TypePartie';
import {RequisPourMotAVerifier} from '../../../../commun/RequisPourMotAVerifier';
import * as requetes from '../../../../commun/constantes/RequetesTempsReel';
import {Indice} from '../../../../server/app/Indice';
import {EmplacementMot} from '../../../../commun/EmplacementMot';
import {Router} from '@angular/router';


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
  public joueur: Joueur = new Joueur();
  private indiceTeste: IndiceMot;
  private motEntre: string;
  private niveauPartie: Niveau;
  private typePartie: TypePartie;
  private nbJoueursPartie: number;

  constructor(private router: Router) {}


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

    for (const emplacementMot of this.partieGeneree.specificationGrilleEnCours.emplacementMots){
      const indiceServeur: Indice = this.trouverIndiceAvecGuid(emplacementMot.obtenirGuidIndice());
      const definition = indiceServeur.definitions[0];
      indices.push(new IndiceMot(emplacementMot.obtenirGuidIndice(), emplacementMot.obtenirIndexFixe() + 1,
        definition, emplacementMot.obtenirGrandeur(), emplacementMot.obtenirPosition(),
        emplacementMot.obtenirCaseDebut().obtenirNumeroColonne() + 1 ,
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
    for (const emplacementMot of this.partieGeneree.specificationGrilleEnCours.emplacementMots){
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
    this.specificationPartie = new SpecificationPartie(Niveau.facile, this.joueur, TypePartie.classique);
    this.connexionTempsReelClient.envoyerRecevoirRequete<SpecificationPartie>(requetes.REQUETE_SERVER_CREER_PARTIE_SOLO,
      this.specificationPartie, requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, this.recupererPartie, this);
    this.connexionTempsReelClient.ecouterRequete(requetes.REQUETE_CLIENT_PARTIE_TERMINE, this.messagePartieTerminee, this);
  }

  public recommencerPartie() {
    this.demanderPartie(this.niveauPartie, this.typePartie, this.nbJoueursPartie);
  }

  public recupererPartie(specificationPartie: SpecificationPartie, self: GameViewService): void {
    self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
    self.mettreAJourGrilleGeneree(self.specificationPartie);
    self.afficherPartie(self.typePartie, self.niveauPartie, self.nbJoueursPartie);
  }

  public demanderVerificationMot(emplacementMot: EmplacementMot, motAtester: string): void {
    const requisPourMotAVerifier: RequisPourMotAVerifier = new RequisPourMotAVerifier(
      emplacementMot, motAtester, this.specificationPartie.joueur.obtenirGuid(), this.specificationPartie.guidPartie);
    this.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourMotAVerifier>(requetes.REQUETE_SERVER_VERIFIER_MOT,
      requisPourMotAVerifier, requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, this.recupererVerificationMot, this);
  }

  public recupererVerificationMot(requisPourMotAVerifier: RequisPourMotAVerifier, self: GameViewService): void {
    if (requisPourMotAVerifier.estLeMot) {
      self.indiceTeste.motTrouve = self.motEntre;
      self.motTrouveJ1.next();
      alert('Bravo, vous avez le bon mot.');
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

  public afficherPartie(typePartie: TypePartie, niveauPartie: Niveau, nbJoueursPartie) {
    this.router.navigate(['/partie/' + typePartie + '/' + niveauPartie + '/' + nbJoueursPartie]);
  }
}
