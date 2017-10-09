
import * as socket from 'socket.io-client';

export const URL_SOCKETIO_SERVER = 'http://localhost:3001';
export const MESSAGE_CONFIRMATION_DECONNEXION_SERVER = 'client_deconnecte';
export const PREMIER_MESSAGE_DU_CLIENT = 'bonjour du client';

export const REQUETE_SERVER_ENVOYER = 'envoyer';
export const REQUETE_SERVER_QUITTER = 'quitter';

export class ConnexionTempsReelClient {
    private estConnecte = false;
    private connexionSocket: SocketIOClient.Socket;

    public demarerConnexionMock(): void {
        const self: ConnexionTempsReelClient = this;
        if (!this.estConnecte) {
            this.connexionSocket = socket.connect(URL_SOCKETIO_SERVER);

            this.connexionSocket.on('connect', function(data) {
                self.connexionSocket.emit(REQUETE_SERVER_ENVOYER, PREMIER_MESSAGE_DU_CLIENT);
                self.connexionSocket.emit(REQUETE_SERVER_QUITTER);
            });

            this.connexionSocket.on('messages', function(data) {
                alert(data);
                if (data === 'Client a quitte') {
                    self.connexionSocket.close();
                    self.estConnecte = false;
                }
            });
            this.estConnecte = true;
        }
    }

    public envoyerRecevoirRequete(nomRequeteAEnvoyer: string, valeurEnvoye: Object, nomRequeteAEcouter: string, callback: any) {
        this.preparerRequete().then((peutPoursuivre: boolean) => {
            this.connexionSocket.on(nomRequeteAEcouter, callback);
            this.connexionSocket.emit(nomRequeteAEnvoyer, valeurEnvoye);
        });
    }

    public recevoirRequete(nomRequete: string, callback: any): void{
        this.preparerRequete().then((peutPoursuivre: boolean) => {
            this.connexionSocket.on(nomRequete, callback);
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

                this.connexionSocket.on('connect', function(data) {
                    self.connexionSocket.emit(REQUETE_SERVER_ENVOYER, PREMIER_MESSAGE_DU_CLIENT);
                    resolve(true);
                });

                this.connexionSocket.on('confirmationConnexion', function(data) {
                    console.log(data);
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
            const self: ConnexionTempsReelClient = this;

            if (this.estConnecte) {
                this.connexionSocket.emit(REQUETE_SERVER_QUITTER);

                this.connexionSocket.on('rappelQuitter', (message) => {
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
