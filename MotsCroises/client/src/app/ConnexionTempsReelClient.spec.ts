import { ConnexionTempsReelClient } from './ConnexionTempsReelClient';
import * as requetes from '../../../commun/constantes/RequetesTempsReel';
import { SpecificationPartie } from '../../../commun/SpecificationPartie';
import { Niveau } from '../../../commun/Niveau';
import { Joueur } from '../../../commun/Joueur';
import { TypePartie } from '../../../commun/TypePartie';
import { RequisPourMotAVerifier } from '../../../commun/requis/RequisPourMotAVerifier';

describe('ConnexionTempsReel', () => {

  it('Une connexion en temps réel peut être créé.', (done) => {
    const connexionTempsReelClient: ConnexionTempsReelClient = new ConnexionTempsReelClient();
    connexionTempsReelClient.demarerConnexion()
      .then((resultat: boolean) => {
        expect(resultat).toBeTruthy();
        done();
      })
      .catch((erreur) => {
        fail(erreur);
        done();
      });
  });

  it('Une connexion en temps réel peut être quitté.', (done) => {
    const connexionTempsReelClient: ConnexionTempsReelClient = new ConnexionTempsReelClient();
    connexionTempsReelClient.demarerConnexion()
      .then((resultat: boolean) => {
        connexionTempsReelClient.seDeconnecter()
          .then((confirmation: boolean) => {
            expect(resultat).toBeTruthy();
            done();
          });
      })
      .catch((erreur) => {
        fail(erreur);
        done();
      });
  });

  it('Il est possible de créer une partie via la connexion temps réel.', (done) => {
    const connexionTempsReelClient: ConnexionTempsReelClient = new ConnexionTempsReelClient();
    const joueur: Joueur = new Joueur();
    const specificationPartie = new SpecificationPartie(Niveau.facile, joueur, TypePartie.classique_a_un);

    connexionTempsReelClient.demarerConnexion()
      .then((resultat: boolean) => {
        connexionTempsReelClient.envoyerRequete(requetes.REQUETE_SERVEUR_CREER_PARTIE_SOLO, specificationPartie);
        connexionTempsReelClient.recevoirRequete(requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO,
          (specificationPartieCree: SpecificationPartie) => {
            expect(specificationPartieCree.guidPartie).toBeDefined();
            expect(specificationPartieCree.specificationGrilleEnCours.cases).toBeDefined();
            expect(specificationPartieCree.specificationGrilleEnCours.emplacementMots).toBeDefined();
            done();
          });
      })
      .catch((erreur) => {
        fail(erreur);
        done();
      });
  });

  it('Il est possible de vérifier un mot en temps réél.', function(done) {
    const connexionTempsReelClient: ConnexionTempsReelClient = new ConnexionTempsReelClient();
    const joueur: Joueur = new Joueur();
    const specificationPartie = new SpecificationPartie(Niveau.facile, joueur, TypePartie.classique_a_un);

    connexionTempsReelClient.demarerConnexion()
      .then((resultat: boolean) => {
        connexionTempsReelClient.envoyerRequete(requetes.REQUETE_SERVEUR_CREER_PARTIE_SOLO, specificationPartie);
        connexionTempsReelClient.recevoirRequete(requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO,
          (specificationPartieCree: SpecificationPartie) => {

            specificationPartieCree = SpecificationPartie.rehydrater(specificationPartieCree);

            const requisPourMotAVerifierMauvais: RequisPourMotAVerifier = new RequisPourMotAVerifier(
              specificationPartieCree.specificationGrilleEnCours.emplacementMots[0],
              'XYZ', specificationPartieCree.joueur.obtenirGuid(), specificationPartieCree.guidPartie);
            connexionTempsReelClient.envoyerRequete(requetes.REQUETE_SERVEUR_VERIFIER_MOT, requisPourMotAVerifierMauvais);
            connexionTempsReelClient.recevoirRequete(requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT,
              (requisPourMotAVerifier: RequisPourMotAVerifier) => {
                expect(requisPourMotAVerifier.estLeMot).toBeFalsy();
                done();

              });
          });
      })
      .catch((erreur) => {
        fail(erreur);
        done();
      });
  });


});
