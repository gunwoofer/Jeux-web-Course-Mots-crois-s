import * as express from 'express';

export const PORT_SOCKET_IO = 3001;

export class ConnexionTempsReel {

    private server: any;
    private io: any;

    constructor(app: express.Application) {
        this.server = require('http').createServer(app);
        this.io = require('socket.io')(this.server);
    }

    public ecouterPourConnexionClients(): void {
        const self: ConnexionTempsReel = this;
        this.io.on('connection', function(client: any) {
            console.log('Client connected...');

            client.on('join', function(data: any) {
                console.log(data);
                client.emit('messages', 'Hello from server');
                client.emit('confirmationConnexion', 'Client a été ajouté.')
            });

            client.on('quitter', function(data: any){
                client.emit('messages', 'Client a quitte');
                self.io.close();
            });

        });
        this.server.listen(PORT_SOCKET_IO);
    }
}
