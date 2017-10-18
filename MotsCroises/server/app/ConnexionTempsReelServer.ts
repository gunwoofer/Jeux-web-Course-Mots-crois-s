import { SpecificationGrille } from './../../commun/SpecificationGrille';
import { Indice } from './Indice';
import * as express from 'express';
import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { Grille } from './Grille';
export const PORT_SOCKET_IO = 3001;
import { SpecificationPartie } from '../../commun/SpecificationPartie';
import * as requetes from '../../commun/constantes/RequetesTempsReel';
import { RequisPourMotAVerifier } from '../../commun/RequisPourMotAVerifier';

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
        this.io.on('connection', (client: SocketIO.Socket) => self.miseEnPlaceRequetesClient(client, self));
        this.server.listen(PORT_SOCKET_IO);
    }

    private miseEnPlaceRequetesClient(client: SocketIO.Socket, self: ConnexionTempsReelServer): void {

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
        client.emit(requetes.REQUETE_CLIENT_MESSAGE, 'Client a quitte');
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_QUITTER, 'client_deconnecte');
        self.io.close();
    }

    public Envoyer(messageClient: string, client: SocketIO.Socket): void {
        client.emit(requetes.REQUETE_CLIENT_MESSAGE, 'Bonjour du serveur.');
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CONNEXION, 'Client a été ajouté.');
    }

    public creerPartieSolo(client: SocketIO.Socket, self: ConnexionTempsReelServer, specificationPartie: SpecificationPartie): void {
        const specificationPartieRecu: SpecificationPartie = SpecificationPartie.rehydrater(specificationPartie);
        const grille: Grille = self.generateurDeGrilleService.genererGrilleMock(specificationPartieRecu.niveau);
        const guidPartie = self.gestionnaireDePartieService.creerPartie(specificationPartieRecu.joueur,
            specificationPartieRecu.typePartie, grille, grille.obtenirNiveau());

        let tableauIndices: Indice[] = new Array();
        tableauIndices = grille.recupererIndices();
        specificationPartieRecu.indices = tableauIndices;

        specificationPartieRecu.guidPartie = guidPartie;
        specificationPartieRecu.specificationGrilleEnCours = new SpecificationGrille(
            grille.obtenirManipulateurCasesSansLettres(), grille.obtenirEmplacementsMot());

        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, specificationPartieRecu);
    }

    public verifierMot(client: SocketIO.Socket, self: ConnexionTempsReelServer, requisPourMotAVerifier: RequisPourMotAVerifier): void {
        requisPourMotAVerifier = RequisPourMotAVerifier.rehydrater(requisPourMotAVerifier);
        const estLeMot = self.gestionnaireDePartieService.estLeMot(requisPourMotAVerifier.emplacementMot.obtenirCaseDebut(),
            requisPourMotAVerifier.emplacementMot.obtenirCaseFin(), requisPourMotAVerifier.motAVerifier,
            requisPourMotAVerifier.guidPartie, requisPourMotAVerifier.guidJoueur);

        if (estLeMot) {
            requisPourMotAVerifier.validerMot();
        }

        client.emit(requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, requisPourMotAVerifier);

        if (estLeMot) {
            const partieTermine = self.gestionnaireDePartieService.voirSiPartieTermine(requisPourMotAVerifier.guidPartie);
            if (partieTermine) {
                client.emit(requetes.REQUETE_CLIENT_PARTIE_TERMINE, partieTermine);
                console.log('partie terminee');
            }
        }
    }
}
