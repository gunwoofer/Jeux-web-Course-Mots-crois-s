import * as express from 'express';
import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Grille } from './Grille';
export const PORT_SOCKET_IO = 3001;
import { SpecificationPartie } from '../../commun/SpecificationPartie';
import * as socket from 'socket.io';
import * as requetes from '../../commun/constantes/RequetesTempsReel';

export class ConnexionTempsReelServer {

    private server: any;
    private io: any;
    private gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
    private generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();

    constructor(app: express.Application) {
        this.server = require('http').createServer(app);
        this.io = require('socket.io')(this.server);
    }

    public ecouterPourConnexionClients(): void {
        const self: ConnexionTempsReelServer = this;
        this.io.on('connection', (client: SocketIO.Socket) => this.miseEnPlaceRequetesClient(client, self));
        this.server.listen(PORT_SOCKET_IO, () => {
            console.log("Listening to " + PORT_SOCKET_IO);
        });
    }

    private miseEnPlaceRequetesClient(client: SocketIO.Socket, self: ConnexionTempsReelServer): void {
        console.log('Client connected...');

        // Requêtes générales
        client.on(requetes.REQUETE_SERVER_ENVOYER, (messageClient: string) => self.Envoyer(messageClient, client));
        client.on(requetes.REQUETE_SERVER_QUITTER, () => self.Quitter(client, self));

        // Requêtes mode classique.
        client.on('partie/creer/solo', (specificationPartie: SpecificationPartie) => self.creerPartieSolo(client, self, specificationPartie));

        // Requêtes mode dynamique.

        // Requêtes multijoueurs.
    }

    public Quitter(client: SocketIO.Socket, self: ConnexionTempsReelServer): void {
        client.emit(requetes.REQUETE_CLIENT_MESSAGE, 'Client a quitte');
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_QUITTER, 'client_deconnecte');
        self.io.close();
    }

    public Envoyer(messageClient: string, client: SocketIO.Socket) {
        console.log(messageClient);
        client.emit(requetes.REQUETE_CLIENT_MESSAGE, 'Bonjour du serveur.');
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CONNEXION, 'Client a été ajouté.');
    }

    public creerPartieSolo(client: SocketIO.Socket, self: ConnexionTempsReelServer, specificationPartie: SpecificationPartie): void {
        const grille: Grille = self.generateurDeGrilleService.genererGrille(specificationPartie.niveau);
        const guidPartie = self.gestionnaireDePartieService.creerPartie(specificationPartie.joueur,
            specificationPartie.typePartie, grille, grille.obtenirNiveau());

        specificationPartie.guidPartie = guidPartie;
    }

}
