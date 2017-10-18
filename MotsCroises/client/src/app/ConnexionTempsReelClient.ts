
import * as socket from 'socket.io-client';
import * as requetes from '../../../commun/constantes/RequetesTempsReel';

export const URL_SOCKETIO_SERVER = 'http://localhost:3001';
export const MESSAGE_CONFIRMATION_DECONNEXION_SERVER = 'client_deconnecte';
export const PREMIER_MESSAGE_DU_CLIENT = 'bonjour du client';

export class ConnexionTempsReelClient {
    private estConnecte = false;
    private connexionSocket: SocketIOClient.Socket;

    public envoyerRecevoirRequete<T>(nomRequeteAEnvoyer: string, valeurEnvoye: T,
        nomRequeteAEcouter: string, callback: any, self: Object) {
        this.preparerRequete().then((peutPoursuivre: boolean) => {
          if ( !this.connexionSocket.hasListeners(nomRequeteAEcouter)) {
            this.connexionSocket.on(nomRequeteAEcouter, (resultat: T) => callback(resultat, self));
          }
            this.connexionSocket.emit(nomRequeteAEnvoyer, valeurEnvoye);
            console.log(this.connexionSocket);
        });
    }

    public recevoirRequete(nomRequete: string, callback: any): void {
        this.preparerRequete().then((peutPoursuivre: boolean) => {
            this.connexionSocket.on(nomRequete, callback);
        });
    }

  public ecouterRequete<T>(nomRequete: string, callback: any): void {
    this.preparerRequete().then((peutPoursuivre: boolean) => {
      this.connexionSocket.on(nomRequete, (resultat: T) => callback(resultat, self));
    });
  }

    public envoyerRequete(nomRequete: string, valeurEnvoye: Object) {
        this.preparerRequete().then((peutPoursuivre: boolean) => {
            this.connexionSocket.emit(nomRequete, valeurEnvoye);
        });
    }

    private preparerRequete(): Promise<boolean> {
        return new Promise((resolve: any, reject: any) => {
            if (!this.estConnecte) {
                this.demarerConnexion()
                    .then((resultat: boolean) => {
                        resolve(resultat);
                    })
                    .catch((erreur) => {
                        resolve(false);
                    });
            } else {
                resolve(true);
            }
        });
    }

    public demarerConnexion(): Promise<boolean> {
        return new Promise((resolve: any, reject: any) => {
            const self: ConnexionTempsReelClient = this;
            if (!this.estConnecte) {
                this.connexionSocket = socket.connect(URL_SOCKETIO_SERVER);

                this.connexionSocket.on('connect', function (data) {
                    self.connexionSocket.emit(requetes.REQUETE_SERVER_ENVOYER, PREMIER_MESSAGE_DU_CLIENT);
                    resolve(true);
                });

                this.connexionSocket.on(requetes.REQUETE_CLIENT_RAPPEL_CONNEXION, function (data) {
                    resolve(true);
                });

                this.estConnecte = true;
            } else {
                resolve(true);
            }
        });
    }

    public seDeconnecter(): Promise<boolean> {
        return new Promise((resolve: any, reject: any) => {

            if (this.estConnecte) {
                this.connexionSocket.emit(requetes.REQUETE_SERVER_QUITTER);

                this.connexionSocket.on(requetes.REQUETE_CLIENT_RAPPEL_QUITTER, (message) => {
                    if (message === MESSAGE_CONFIRMATION_DECONNEXION_SERVER) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            } else {
                resolve(true);
            }
        });
    }
}
