import {Injectable} from '@angular/core';
import {ConnexionTempsReelClient} from './connexionTempsReelClient';
import {SpecificationPartie} from '../../../../commun/specificationPartie';
import {ChoixPartieService} from '../choix_partie/choix-partie.service';
import {GameViewService} from '../game_view/game-view.service';
import * as requetes from '../../../../commun/constantes/requetesTempsReel';


@Injectable()
export class ConnexionTempsReelClientService {
    public connexionTempsReelClient: ConnexionTempsReelClient;

    constructor() {
        this.connexionTempsReelClient = new ConnexionTempsReelClient();
    }

/*
    public demanderPartieServer(nbJoueurs: number, specificationPartie: SpecificationPartie) {
        if (nbJoueurs === 0) {
            this.connexionTempsReelClient.envoyerRecevoirRequete<SpecificationPartie>(requetes.REQUETE_SERVEUR_CREER_PARTIE_SOLO,
                specificationPartie, requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, this.choixPartieService.recupererPartie, this);
        } else {
            if (this.demanderNomJoueur()) {
                this.connexionTempsReelClient.envoyerRecevoirRequete<SpecificationPartie>(requetes.REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR,
                    specificationPartie, requetes.REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR_RAPPEL, this.choixPartieService.recupererPartie, this);
                this.ecouterRetourRejoindrePartieMultijoueur();
            }
        }
    }

    public ecouterRetourRejoindrePartieMultijoueur(): void {
        this.connexionTempsReelClient.ecouterRequete(
            requetes.REQUETE_SERVEUR_JOINDRE_PARTIE_RAPPEL, this.choixPartieService.rappelRejoindrePartieMultijoueur, this
        );
    }*/

    private demanderNomJoueur(): boolean {
        const playerName = prompt('Please enter your name:', '');
        if (playerName !== null && playerName !== '') {
            //this.gameViewService.joueur.changerNomJoueur(playerName);
            return true;
        }
        return false;
    }
}
