import { GenerateurDeGrilleService } from './generateurDeGrilleService';
import { GestionnaireDePartieService } from './gestionnaireDePartieService';
import { SpecificationPartie } from '../../commun/specificationPartie';
import { RequisPourMotAVerifier } from '../../commun/requis/requisPourMotAVerifier';
import { RequisPourSelectionnerMot } from '../../commun/requis/requisPourSelectionnerMot';
import { RequisPourObtenirTempsRestant } from '../../commun/requis/requisPourObtenirTempsRestant';
import { DescripteurEvenementTempsReel } from './descripteurEvenementTempsReel';
import { RequisPourMotsTrouve } from '../../commun/requis/requisPourMotsTrouve';
import { RequisDemandeListePartieEnAttente } from '../../commun/requis/requisDemandeListePartieEnAttente';
import { RequisPourMotsComplets } from '../../commun/requis/requisPourMotsComplets';
import { RequisPourJoindrePartieMultijoueur } from '../../commun/requis/requisPourJoindrePartieMultijoueur';
import { RequisPourModifierTempsRestant } from '../../commun/requis/requisPourModifierTempsRestant';
import * as requetes from '../../commun/constantes/requetesTempsReel';
import * as express from 'express';

export const PORT_SOCKET_IO = 3001;

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
            self.descripteurEvenementTempsReel.envoyer(messageClient, client));
        client.on(requetes.REQUETE_SERVEUR_QUITTER, () => self.descripteurEvenementTempsReel.quitter(client, self.io));

        // Requêtes mode classique un joueur.
        client.on(requetes.REQUETE_SERVEUR_CREER_PARTIE_SOLO,
            (specificationPartie: SpecificationPartie) =>
                self.descripteurEvenementTempsReel.creerPartieSolo(client, self.gestionnaireDePartieService,
                    self.generateurDeGrilleService, specificationPartie));

        client.on(requetes.REQUETE_SERVEUR_VERIFIER_MOT,
            (requisPourMotAVerifier: RequisPourMotAVerifier) =>
                self.descripteurEvenementTempsReel.verifierMot(client, self.gestionnaireDePartieService,
                    requisPourMotAVerifier, self.clientSockets));

        // Requêtes partie deux joueurs
        client.on(requetes.REQUETE_SERVEUR_CHANGER_EMPLACEMENT_MOT_SELECTIONNER,
            (requisPourSelectionnerMot: RequisPourSelectionnerMot) =>
                self.descripteurEvenementTempsReel.changerEmplacementMotSelectionner(client, self.gestionnaireDePartieService,
                    self.clientSockets, requisPourSelectionnerMot));

        client.on(requetes.REQUETE_SERVEUR_OBTENIR_TEMPS_RESTANT, (requisPourObtenirTempsRestant: RequisPourObtenirTempsRestant) =>
            self.descripteurEvenementTempsReel.obtenirTempsRestant(client, self.gestionnaireDePartieService,
                requisPourObtenirTempsRestant, self.clientSockets));

        client.on(requetes.REQUETE_SERVEUR_MODIFIER_TEMPS_RESTANT, (requisPourModifierTempsRestant: RequisPourModifierTempsRestant) =>
            self.descripteurEvenementTempsReel.modifierTempsRestant(client, self.gestionnaireDePartieService,
                requisPourModifierTempsRestant, self.clientSockets));

        client.on(requetes.REQUETE_SERVEUR_OBTENIR_MOTS_TROUVES, (requisPourMotsTrouve: RequisPourMotsTrouve) =>
            self.descripteurEvenementTempsReel.obtenirMotsTrouve(client, self.gestionnaireDePartieService,
                requisPourMotsTrouve, self.clientSockets));

        client.on(requetes.REQUETE_SERVEUR_DEMANDE_LISTE_PARTIES_EN_COURS,
            (requisDemandeListePartieEnAttente: RequisDemandeListePartieEnAttente) => self.descripteurEvenementTempsReel
                .obtenirDemandeListePartiesEnCours(client, self.gestionnaireDePartieService,
                    requisDemandeListePartieEnAttente));

        client.on(requetes.REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR,
            (specificationPartie: SpecificationPartie) =>
                self.descripteurEvenementTempsReel.creerPartieMultijoueur(client, self.gestionnaireDePartieService,
                    self.generateurDeGrilleService, specificationPartie));

        client.on(requetes.REQUETE_SERVEUR_JOINDRE_PARTIE,
            (requisPourJoindrePartieMultijoueur: RequisPourJoindrePartieMultijoueur) =>
                self.descripteurEvenementTempsReel.joindrePartieMultijoueur(client, self.gestionnaireDePartieService,
                    self.generateurDeGrilleService, requisPourJoindrePartieMultijoueur, self.clientSockets));

        client.on(requetes.REQUETE_SERVER_OBTENIR_MOTS_COMPLETS_CHEAT_MODE,
            (requisPourMotComplet: RequisPourMotsComplets) =>
                self.descripteurEvenementTempsReel.obtenirMotsComplets(client, self.gestionnaireDePartieService, requisPourMotComplet));
    }
}
