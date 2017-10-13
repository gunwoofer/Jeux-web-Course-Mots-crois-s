import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {SpecificationPartie} from '../../../../commun/SpecificationPartie';
import {Indice} from '../indice/indice';
import {ConnexionTempsReelClient} from '../ConnexionTempsReelClient';
import {Joueur} from '../../../../commun/Joueur';
import {Niveau} from '../../../../commun/Niveau';
import {TypePartie} from '../../../../commun/TypePartie';
import {ConnexionTempsReelService} from '../ConnexionTempsReel.service';
import {RequisPourMotAVerifier} from '../../../../commun/RequisPourMotAVerifier';
import * as requetes from '../../../../commun/constantes/RequetesTempsReel';


@Injectable()
export class GameViewService {
  private grilleGenere = new Subject<SpecificationPartie>();
  public grilleGenere$ = this.grilleGenere.asObservable();

  private partieGeneree: SpecificationPartie;
  public indices: Indice[];

  constructor() {
  }

  public mettreAJourGrilleGeneree(specificationPartie: SpecificationPartie) {
    this.partieGeneree = specificationPartie;
    this.MAJIndices(this.partieGeneree);
    console.log('specification partie arrivée :', specificationPartie);
  }

  public mettreAJourIndice(indices: Indice[]) {
    this.indices = indices;
  }

  public getPartie() {
    return this.partieGeneree;
  }

  private MAJIndices(specificationPartie: SpecificationPartie){
    const indices: Indice[] = new Array();
    console.log(this.partieGeneree.specificationGrilleEnCours.emplacementMots);
    for (const i of this.partieGeneree.specificationGrilleEnCours.emplacementMots){
      indices.push(new Indice(i.obtenirIndexFixe() + 1, i.obtenirGuidIndice(), i.obtenirGrandeur(), i.obtenirPosition(),
        i.obtenirCaseDebut().obtenirNumeroColonne() + 1 ,
        i.obtenirCaseDebut().obtenirNumeroLigne() + 1, ''));
    }
    this.indices = indices;
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

  public recupererPartie(specificationPartie: SpecificationPartie, self: ConnexionTempsReelService) {
    self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
    console.log('specification partie 1:', self.specificationPartie);
    // console.log(self.gameViewService);
    this.mettreAJourGrilleGeneree(self.specificationPartie);
  }

  public demanderVerificationMot(specificationPartie: SpecificationPartie, self: ConnexionTempsReelService) {
    // REQUETE VERIFIER MOT
    const requisPourMotAVerifierMauvais: RequisPourMotAVerifier = new RequisPourMotAVerifier(
      self.specificationPartie.specificationGrilleEnCours.emplacementMots[0],
      'XYZ', self.specificationPartie.joueur.obtenirGuid(), self.specificationPartie.guidPartie);
    self.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourMotAVerifier>(requetes.REQUETE_SERVER_VERIFIER_MOT,
      requisPourMotAVerifierMauvais, requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, self.recupererVerificationMot, this);
  }

  public recupererVerificationMot(requisPourMotAVerifier: RequisPourMotAVerifier, self: ConnexionTempsReelService) {
    if (requisPourMotAVerifier.estLeMot) {
      // alert('Bravo, vous avez le bon mot.');
    } else {
      // alert('Malheureusement, ce n\'est pas le bon mot.');
    }
  }
}
