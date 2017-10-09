import { TestBed, inject } from '@angular/core/testing';

import { AppModule } from './app.module';

import { BasicService } from './basic.service';

import { ConnexionTempsReelClient } from './ConnexionTempsReelClient';


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
