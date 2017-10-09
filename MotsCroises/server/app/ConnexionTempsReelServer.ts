import * as express from 'express';
import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Grille } from './Grille';
export const PORT_SOCKET_IO = 3001;

export class ConnexionTempsReelServer {

    private server: any;
    private io: any;
    private gestionnaireDePartieService: GestionnaireDePartieService= new GestionnaireDePartieService();
    private generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();

    constructor(app: express.Application) {
        this.server = require('http').createServer(app);
        this.io = require('socket.io')(this.server);
    }

    public ecouterPourConnexionClients(): void {
        const self: ConnexionTempsReelServer = this;
        this.io.on('connection', (client: SocketIO.Socket) => this.miseEnPlaceRequetesClient(client, self));
        this.server.listen(PORT_SOCKET_IO);
    }

    private miseEnPlaceRequetesClient(client: SocketIO.Socket, self: ConnexionTempsReelServer): void {
        console.log('Client connected...');

        // Requêtes générales
        client.on('envoyer', (messageClient: string) => self.Envoyer(messageClient, client));
        client.on('quitter', () => self.Quitter(client, self));

        // Requêtes mode classique.
        //client.on('partie/creer', () => self.creerPartie());

        // Requêtes mode dynamique.

        // Requêtes multijoueurs.
    }

    public Quitter(client: SocketIO.Socket, self: ConnexionTempsReelServer): void {
        client.emit('messages', 'Client a quitte');
        client.emit('rappelQuitter', 'client_deconnecte');
        self.io.close();
    }

    public Envoyer(messageClient: string, client: SocketIO.Socket) {
        console.log(messageClient);
        client.emit('messages', 'Hello from server');
        client.emit('confirmationConnexion', 'Client a été ajouté.');
    }
    /*
    public creerPartie(, client: SocketIO.Socket, self: ConnexionTempsReelServer): void {
        let grille: Grille = self.generateurDeGrilleService.genererGrille(niveau);
        self.gestionnaireDePartieService.creerPartie()
    }
    */
}
