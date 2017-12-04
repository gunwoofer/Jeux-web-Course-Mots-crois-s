import {Niveau} from '../../../../commun/niveau';
import {TypePartie} from '../../../../commun/typePartie';
import {GameViewService} from './game-view.service';
import {inject, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';


describe('GameViewService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GameViewService,
        RouterTestingModule],
      imports: [
        RouterTestingModule.withRoutes([]),
      ]
    });
  });

  it('doit creer le service', inject([GameViewService], (service: GameViewService) => {
    expect(service).toBeTruthy();
  }));

  it('se connecter au serveur', inject([GameViewService], (service: GameViewService) => {
    service.initialiserConnexion();
    service.connexionTempsReelClient.demarerConnexion().then((data) => {
      expect(data).toBe(true);
    });
  }));

  it('partie nulle si pas de demande de partie', inject([GameViewService], (service: GameViewService) => {
    service.initialiserConnexion();
    service.connexionTempsReelClient.demarerConnexion();
    console.log(service.specificationPartie);
    expect(service.specificationPartie).toBeUndefined();
  }));

  it('partie existe après demande de partie', inject([GameViewService], (service: GameViewService) => {
    service.initialiserConnexion();
    service.connexionTempsReelClient.demarerConnexion();
    console.log(service.specificationPartie);
    service.demanderPartie(Niveau.facile, TypePartie.classique_a_un, 0);
    expect(service.specificationPartie).not.toBeUndefined();
  }));

/*  it('modifie le temps de la partie', inject([GameViewService], (service: GameViewService) => {
    service.initialiserConnexion();
    service.connexionTempsReelClient.demarerConnexion();
    console.log(service.specificationPartie);
    service.demanderPartie(Niveau.facile, TypePartie.classique_a_un, 0);
    service.modifierTempsServeur(200);
    setTimeout(function() {
      expect(service.requisPourObtenirTempsRestant.tempsRestant).toEqual(200);
    }, 1000);
  }));*/





  /*

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

    it('Il est possible de vérifier un mot en temps réél.', (done) => {
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
  */


});
