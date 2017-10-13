import * as express from 'express';
import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Grille } from './Grille';
export const PORT_SOCKET_IO = 3001;
import { SpecificationPartie } from '../../commun/SpecificationPartie';
import { SpecificationGrille } from '../../commun/SpecificationGrille';
import * as requetes from '../../commun/constantes/RequetesTempsReel';
import { RequisPourMotAVerifier } from '../../commun/RequisPourMotAVerifier';

export class ConnexionTempsReelServer {

    private server: any;
    private io: any;
    private gestionnaireDePartieService: GestionnaireDePartieService = new GestionnaireDePartieService();
    private generateurDeGrilleService: GenerateurDeGrilleService = new GenerateurDeGrilleService();

    constructor(app: express.Application) {
        console.log('création instance');
        this.server = require('http').createServer(app);
        this.io = require('socket.io')(this.server);
    }

    public ecouterPourConnexionClients(): void {
        const self: ConnexionTempsReelServer = this;
        this.io.on('connection', (client: SocketIO.Socket) => self.miseEnPlaceRequetesClient(client, self));
        this.server.listen(PORT_SOCKET_IO);
        console.log('ecoute : ' + PORT_SOCKET_IO);
    }

    private miseEnPlaceRequetesClient(client: SocketIO.Socket, self: ConnexionTempsReelServer): void {
        console.log('Client connected...');

        // Requêtes générales
        client.on(requetes.REQUETE_SERVER_ENVOYER, (messageClient: string) => self.Envoyer(messageClient, client));
        client.on(requetes.REQUETE_SERVER_QUITTER, () => self.Quitter(client, self));

        // Requêtes mode classique.
        client.on(requetes.REQUETE_SERVER_CREER_PARTIE_SOLO,
            (specificationPartie: SpecificationPartie) => self.creerPartieSolo(client, self, specificationPartie));
        client.on(requetes.REQUETE_SERVER_VERIFIER_MOT,
            (requisPourMotAVerifier: RequisPourMotAVerifier) => self.verifierMot(client, self, requisPourMotAVerifier));
    }

    public Quitter(client: SocketIO.Socket, self: ConnexionTempsReelServer): void {
        console.log(requetes.REQUETE_SERVER_QUITTER);

        client.emit(requetes.REQUETE_CLIENT_MESSAGE, 'Client a quitte');
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_QUITTER, 'client_deconnecte');
        self.io.close();
    }

    public Envoyer(messageClient: string, client: SocketIO.Socket) {
        console.log(requetes.REQUETE_SERVER_ENVOYER);

        client.emit(requetes.REQUETE_CLIENT_MESSAGE, 'Bonjour du serveur.');
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CONNEXION, 'Client a été ajouté.');
    }

    public creerPartieSolo(client: SocketIO.Socket, self: ConnexionTempsReelServer, specificationPartie: SpecificationPartie): void {
        console.log(requetes.REQUETE_SERVER_CREER_PARTIE_SOLO);

        const grille: Grille = self.generateurDeGrilleService.genererGrilleMock(specificationPartie.niveau);
        const guidPartie = self.gestionnaireDePartieService.creerPartie(specificationPartie.joueur,
            specificationPartie.typePartie, grille, grille.obtenirNiveau());

        specificationPartie.guidPartie = guidPartie;
        specificationPartie.specificationGrilleEnCours = new SpecificationGrille(
            grille.obtenirManipulateurCases(), grille.obtenirEmplacementsMot());

        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, specificationPartie);

    }

    public verifierMot(client: SocketIO.Socket, self: ConnexionTempsReelServer, requisPourMotAVerifier: RequisPourMotAVerifier) {
        console.log(requetes.REQUETE_SERVER_VERIFIER_MOT);
        requisPourMotAVerifier = RequisPourMotAVerifier.rehydrater(requisPourMotAVerifier);
        const estLeMot = self.gestionnaireDePartieService.estLeMot(requisPourMotAVerifier.emplacementMot.obtenirCaseDebut(),
            requisPourMotAVerifier.emplacementMot.obtenirCaseFin(), requisPourMotAVerifier.motAVerifier,
            requisPourMotAVerifier.guidPartie, requisPourMotAVerifier.guidJoueur);

        if(estLeMot) {
            requisPourMotAVerifier.validerMot();
        }

        client.emit(requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, requisPourMotAVerifier);

        if (estLeMot) {
            const partieTermine = self.gestionnaireDePartieService.voirSiPartieTermine(requisPourMotAVerifier.guidPartie);

            if (partieTermine) {
                client.emit(requetes.REQUETE_CLIENT_PARTIE_TERMINE, partieTermine);
            }
        }
    }

}
