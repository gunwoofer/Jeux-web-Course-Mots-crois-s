import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { SpecificationPartie } from '../../commun/SpecificationPartie';
import { RequisPourMotAVerifier } from '../../commun/requis/RequisPourMotAVerifier';
import { RequisPourSelectionnerMot } from '../../commun/requis/RequisPourSelectionnerMot';
import { RequisPourObtenirTempsRestant } from '../../commun/requis/RequisPourObtenirTempsRestant';
import { DescripteurEvenementTempsReel } from './DescripteurEvenementTempsReel';
import { RequisPourMotsTrouve } from '../../commun/requis/RequisPourMotsTrouve';
import { RequisDemandeListePartieEnCours } from '../../commun/requis/RequisDemandeListePartieEnCours';

import * as express from 'express';

export const PORT_SOCKET_IO = 3001;
import * as requetes from '../../commun/constantes/RequetesTempsReel';

export class ConnexionTempsReelServer {

    private server: any;
    private io: any;
    private gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
    private generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();
    private descripteurEvenementTempsReel: DescripteurEvenementTempsReel = new DescripteurEvenementTempsReel();

    private clientSockets: SocketIO.Socket[] = new Array();

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

        this.clientSockets.push(client);

        // Requêtes générales
        client.on(requetes.REQUETE_SERVEUR_ENVOYER, (messageClient: string) =>
        self.descripteurEvenementTempsReel.Envoyer(messageClient, client));
        client.on(requetes.REQUETE_SERVEUR_QUITTER, () => self.descripteurEvenementTempsReel.Quitter(client, self.io));

        // Requêtes mode classique.
        client.on(requetes.REQUETE_SERVEUR_CREER_PARTIE_SOLO,
            (specificationPartie: SpecificationPartie) => 
            self.descripteurEvenementTempsReel.creerPartieSolo(client, self.gestionnaireDePartieService,
                self.generateurDeGrilleService, specificationPartie));
        client.on(requetes.REQUETE_SERVEUR_VERIFIER_MOT,
            (requisPourMotAVerifier: RequisPourMotAVerifier) => 
            self.descripteurEvenementTempsReel.verifierMot(client, self.gestionnaireDePartieService,
                requisPourMotAVerifier, self.clientSockets));
        client.on(requetes.REQUETE_SERVEUR_CHANGER_EMPLACEMENT_MOT_SELECTIONNER,
            (requisPourSelectionnerMot: RequisPourSelectionnerMot) =>
            self.descripteurEvenementTempsReel.changerEmplacementMotSelectionner(client, self.gestionnaireDePartieService, 
                self.clientSockets, requisPourSelectionnerMot));
        client.on(requetes.REQUETE_SERVEUR_OBTENIR_TEMPS_RESTANT, (requisPourObtenirTempsRestant: RequisPourObtenirTempsRestant) =>
            self.descripteurEvenementTempsReel.obtenirTempsRestant(client, self.io, requisPourObtenirTempsRestant, self.clientSockets));
        client.on(requetes.REQUETE_SERVEUR_OBTENIR_MOTS_TROUVES, (requisPourMotsTrouve: RequisPourMotsTrouve) =>
            self.descripteurEvenementTempsReel.obtenirMotsTrouve(client, self.io, requisPourMotsTrouve, self.clientSockets));
        client.on(requetes.REQUETE_SERVEUR_DEMANDE_LISTE_PARTIES_EN_COURS,
            (requisDemandeListePartieEnCours: RequisDemandeListePartieEnCours) => self.descripteurEvenementTempsReel
            .obtenirDemandeListePartiesEnCours(client, self.gestionnaireDePartieService,
                requisDemandeListePartieEnCours));
    }
}
