import { TestBed, inject } from '@angular/core/testing';
import { AppModule } from './app.module';
import { BasicService } from './basic.service';
import { ConnexionTempsReelClient } from './ConnexionTempsReelClient';
import * as requetes from '../../../commun/constantes/RequetesTempsReel';
import { SpecificationPartie } from '../../../commun/SpecificationPartie';
import { Niveau } from '../../../commun/Niveau';
import { Joueur } from '../../../commun/Joueur';
import { TypePartie } from '../../../commun/TypePartie';


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
    const specificationPartie = new SpecificationPartie(Niveau.facile, joueur, TypePartie.classique);

    connexionTempsReelClient.demarerConnexion()
      .then((resultat: boolean) => {
        connexionTempsReelClient.envoyerRequete(requetes.REQUETE_SERVER_CREER_PARTIE_SOLO, specificationPartie);
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


});
