import { ConnexionTempsReelClient } from './connexionTempsReelClient';
import * as requetes from '../../../../commun/constantes/requetesTempsReel';
import { SpecificationPartie } from '../../../../commun/specificationPartie';
import { Niveau } from '../../../../commun/niveau';
import { Joueur } from '../../../../commun/joueur';
import { TypePartie } from '../../../../commun/typePartie';
import { RequisPourMotAVerifier } from '../../../../commun/requis/requisPourMotAVerifier';

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
});
