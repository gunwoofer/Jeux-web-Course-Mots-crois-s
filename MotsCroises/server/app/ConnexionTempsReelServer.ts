import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { SpecificationPartie } from '../../commun/SpecificationPartie';
import { RequisPourMotAVerifier } from '../../commun/requis/RequisPourMotAVerifier';
import { RequisPourSelectionnerMot } from '../../commun/requis/RequisPourSelectionnerMot';
import { RequisPourObtenirTempsRestant } from '../../commun/requis/RequisPourObtenirTempsRestant';
import { DescripteurEvenementTempsReel } from './DescripteurEvenementTempsReel';

import * as express from 'express';

export const PORT_SOCKET_IO = 3001;
import * as requetes from '../../commun/constantes/RequetesTempsReel';

export class ConnexionTempsReelServer {

    private server: any;
    private io: any;
    private gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
    private generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();
    private descripteurEvenementTempsReel: DescripteurEvenementTempsReel = new DescripteurEvenementTempsReel();

    private clientSocket: SocketIO.Socket[] = new Array();

    constructor(app: express.Application) {
        this.server = require('http').createServer(app);
        this.io = require('socket.io')(this.server);
    } 

    public ecouterPourConnexionClients(): void {
        const self: ConnexionTempsReelServer = this;
        this.io.on('connection', (client: SocketIO.Socket) => self.miseEnPlaceRequetesClient(client, self));
        this.server.listen(PORT_SOCKET_IO);
    }

    private miseEnPlaceRequetesClient(client: SocketIO.Socket, self: ConnexionTempsReelServer): void {

        this.clientSocket.push(client);

        // Requêtes générales
        client.on(requetes.REQUETE_SERVER_ENVOYER, (messageClient: string) =>
        self.descripteurEvenementTempsReel.Envoyer(messageClient, client));
        client.on(requetes.REQUETE_SERVER_QUITTER, () => self.descripteurEvenementTempsReel.Quitter(client, self.io));

        // Requêtes mode classique.
        client.on(requetes.REQUETE_SERVER_CREER_PARTIE_SOLO,
            (specificationPartie: SpecificationPartie) => 
            self.descripteurEvenementTempsReel.creerPartieSolo(client, self.gestionnaireDePartieService, 
                self.generateurDeGrilleService, specificationPartie));
        client.on(requetes.REQUETE_SERVER_VERIFIER_MOT,
            (requisPourMotAVerifier: RequisPourMotAVerifier) => 
            self.descripteurEvenementTempsReel.verifierMot(client, self.gestionnaireDePartieService, requisPourMotAVerifier));
        client.on(requetes.REQUETE_SERVER_CHANGER_EMPLACEMENT_MOT_SELECTIONNER,
            (requisPourSelectionnerMot: RequisPourSelectionnerMot) =>
            self.descripteurEvenementTempsReel.changerEmplacementMotSelectionner(client, self.gestionnaireDePartieService, 
                self.clientSocket, requisPourSelectionnerMot));
        client.on(requetes.REQUETE_SERVER_OBTENIR_TEMPS_RESTANT, (requisPourObtenirTempsRestant: RequisPourObtenirTempsRestant) =>
            self.descripteurEvenementTempsReel.obtenirTempsRestant(client, self.io, requisPourObtenirTempsRestant));
    }
}
