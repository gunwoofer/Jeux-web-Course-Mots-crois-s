import {Injectable} from '@angular/core';
import {ConnexionTempsReelClient} from './ConnexionTempsReelClient';
import {Joueur} from '../../../commun/Joueur';
import {Niveau} from '../../../commun/Niveau';
import {TypePartie} from '../../../commun/TypePartie';
import {SpecificationPartie} from '../../../commun/SpecificationPartie';
import {RequisPourMotAVerifier} from '../../../commun/RequisPourMotAVerifier';
import * as requetes from '../../../commun/constantes/RequetesTempsReel';


@Injectable()

export class ConnexionTempsReelService {
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

  public recupererPartie(specificationPartie: SpecificationPartie, self: ConnexionTempsReelService){
    self.specificationPartie = SpecificationPartie.rehydrater(specificationPartie);
    console.log('specification partie 1:', self.specificationPartie );
    // console.log(self.gameViewService);
    // self.gameViewService.mettreAJourGrilleGeneree(self.specificationPartie);
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