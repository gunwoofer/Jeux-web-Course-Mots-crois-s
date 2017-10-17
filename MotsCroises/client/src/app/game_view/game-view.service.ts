import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import {IndiceMot} from '../indice/indiceMot';
import {ConnexionTempsReelClient} from '../ConnexionTempsReelClient';
import {Joueur} from '../../../../commun/Joueur';
import {Niveau} from '../../../../commun/Niveau';
import {TypePartie} from '../../../../commun/TypePartie';
import {ConnexionTempsReelService} from '../ConnexionTempsReel.service';
import {RequisPourMotAVerifier} from '../../../../commun/RequisPourMotAVerifier';
import * as requetes from '../../../../commun/constantes/RequetesTempsReel';
import {Indice} from "../../../../server/app/Indice";
import {EmplacementMot} from "../../../../commun/EmplacementMot";


@Injectable()
export class GameViewService {
  private grilleGenere = new Subject<SpecificationPartie>();
  public grilleGenere$ = this.grilleGenere.asObservable();

  private partieGeneree: SpecificationPartie;
  public indices: IndiceMot[];

  constructor() {
  }

  public mettreAJourGrilleGeneree(specificationPartie: SpecificationPartie) {
    this.partieGeneree = specificationPartie;
    this.MAJIndices(this.partieGeneree);
    console.log('specification partie arrivée :', specificationPartie);
  }

  public mettreAJourIndice(indices: IndiceMot[]) {
    this.indices = indices;
  }

  public getPartie() {
    return this.partieGeneree;
  }

  private MAJIndices(specificationPartie: SpecificationPartie) {
    const indices: IndiceMot[] = new Array();
    console.log(this.partieGeneree.specificationGrilleEnCours.emplacementMots);
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
    console.log('spe part : ', this.partieGeneree);
    for (const indiceServeur of this.partieGeneree.indices){
      if(indiceServeur.id === guid){
        return indiceServeur;
      }
    }
    return null;
  }

  private trouverEmplacementMotAvecGuid(guid: string): EmplacementMot {
    console.log('spe part : ', this.partieGeneree);
    for (const emplacementMot of this.partieGeneree.specificationGrilleEnCours.emplacementMots){
      if(emplacementMot.obtenirGuidIndice() === guid){
        return emplacementMot;
      }
    }
    return null;
  }

  public testMotEntre(motAtester: string, indice: IndiceMot){
    const emplacementMot = this.trouverEmplacementMotAvecGuid(indice.guidIndice);
    this.demanderVerificationMot(emplacementMot, motAtester);
  }



  public connexionTempsReelClient: ConnexionTempsReelClient;
  public specificationPartie: SpecificationPartie;
  public joueur: Joueur = new Joueur();


  public initialiserConnexion() {
    this.connexionTempsReelClient = new ConnexionTempsReelClient();
  }

  public demanderPartie(niveau: Niveau, typePartie: TypePartie) {
    this.specificationPartie = new SpecificationPartie(Niveau.facile, this.joueur, TypePartie.classique);
    this.connexionTempsReelClient.envoyerRecevoirRequete<SpecificationPartie>(requetes.REQUETE_SERVER_CREER_PARTIE_SOLO,
      this.specificationPartie, requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, this.recupererPartie, this);
  }

  public recupererPartie(specificationPartie: SpecificationPartie, self: GameViewService) {
    self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
    console.log('specification partie 1:', self.specificationPartie);
    // console.log(self.gameViewService);
    self.mettreAJourGrilleGeneree(self.specificationPartie);
  }

  public demanderVerificationMot(emplacementMot: EmplacementMot, motAtester: string) {
    // REQUETE VERIFIER MOT
    const requisPourMotAVerifier: RequisPourMotAVerifier = new RequisPourMotAVerifier(
      emplacementMot, motAtester, this.specificationPartie.joueur.obtenirGuid(), this.specificationPartie.guidPartie);
    console.log('demande verif', requisPourMotAVerifier);
    this.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourMotAVerifier>(requetes.REQUETE_SERVER_VERIFIER_MOT,
      requisPourMotAVerifier, requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, this.recupererVerificationMot, this);
  }

  public recupererVerificationMot(requisPourMotAVerifier: RequisPourMotAVerifier, self: ConnexionTempsReelService) {
    console.log("retour");
    if (requisPourMotAVerifier.estLeMot) {
      // alert('Bravo, vous avez le bon mot.');
    } else {
      alert('Malheureusement, ce n\'est pas le bon mot.');
    }
  }
}
