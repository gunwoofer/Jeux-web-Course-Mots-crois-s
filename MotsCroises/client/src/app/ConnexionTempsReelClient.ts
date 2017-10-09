
import * as socket from 'socket.io-client';

export const URL_SOCKETIO_SERVER = 'http://localhost:3001';

export class ConnexionTempsReelClient {
    private estConnecte = false;
    private connexionSocket: SocketIOClient.Socket;

    public demarerConnexionMock(): void {
        const self: ConnexionTempsReelClient = this;
        if (!this.estConnecte) {
            this.connexionSocket = socket.connect(URL_SOCKETIO_SERVER);

            this.connexionSocket.on('connect', function(data) {
                self.connexionSocket.emit('join', 'Hello World from client');
                self.connexionSocket.emit('quitter');
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

    public envoyerRequete(nomRequete: string, valeurEnvoye: Object, callback: any): void{
        if (this.estConnecte) {
            this.connexionSocket.on(nomRequete, callback(valeurEnvoye));
        }
    }

    public demarerConnexion(): Promise<boolean> {
        return new Promise((resolve: any, reject: any) => {
            const self: ConnexionTempsReelClient = this;
            if (!this.estConnecte) {
                this.connexionSocket = socket.connect(URL_SOCKETIO_SERVER);

                this.connexionSocket.on('connect', function(data) {
                    self.connexionSocket.emit('join', 'Demande connexion client');
                    resolve(true);
                });

                this.connexionSocket.on('confirmationConnexion', function(data) {
                    console.log(data);
                    resolve(true);
                });

                this.estConnecte = true;
            }
        });
    }
}
