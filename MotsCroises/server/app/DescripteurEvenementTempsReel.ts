import * as requetes from '../../commun/constantes/RequetesTempsReel';
import {Grille} from './Grille';
import {Partie} from './Partie';
import {SpecificationPartie} from '../../commun/SpecificationPartie';
import {RequisPourMotAVerifier} from '../../commun/requis/RequisPourMotAVerifier';
import {RequisPourSelectionnerMot} from '../../commun/requis/RequisPourSelectionnerMot';
import {SpecificationGrille} from './../../commun/SpecificationGrille';
import {Indice} from './Indice';
import {GestionnaireDePartieService} from './GestionnaireDePartieService';
import {GenerateurDeGrilleService} from './GenerateurDeGrilleService';
import {RequisPourObtenirTempsRestant} from '../../commun/requis/RequisPourObtenirTempsRestant';
import {RequisPourMotsTrouve} from '../../commun/requis/RequisPourMotsTrouve';
import {RequisDemandeListePartieEnAttente} from '../../commun/requis/RequisDemandeListePartieEnAttente';
import {VuePartieEnCours} from '../../commun/VuePartieEnCours';
import {RequisPourJoindrePartieMultijoueur} from '../../commun/requis/RequisPourJoindrePartieMultijoueur';
import {EtatPartie} from '../../commun/EtatPartie';

export class DescripteurEvenementTempsReel {
    public Quitter(client: SocketIO.Socket, io: any): void {
        client.emit(requetes.REQUETE_CLIENT_MESSAGE, 'Client a quitte');
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_QUITTER, 'client_deconnecte');
        io.close();
    }

    public Envoyer(messageClient: string, client: SocketIO.Socket): void {
        client.emit(requetes.REQUETE_CLIENT_MESSAGE, 'Bonjour du serveur.');
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CONNEXION, 'Client a été ajouté.');
    }

    public creerPartieSolo(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                           generateurDeGrilleService: GenerateurDeGrilleService, specificationPartie: SpecificationPartie): void {
        let specificationPartieRecu: SpecificationPartie = SpecificationPartie.rehydrater(specificationPartie);

        specificationPartieRecu = this.preparerNouvellePartie(gestionnaireDePartieService,
            generateurDeGrilleService, specificationPartieRecu);

        // La partie solo peut être démarrer dès sa création.
        gestionnaireDePartieService.obtenirPartieEnCours(specificationPartieRecu.guidPartie).demarrerPartie();

        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, specificationPartieRecu);
    }

    public creerPartieMultijoueur(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                                  generateurDeGrilleService: GenerateurDeGrilleService, specificationPartie: SpecificationPartie): void {

        let specificationPartieRecu: SpecificationPartie = SpecificationPartie.rehydrater(specificationPartie);

        specificationPartieRecu = this.preparerNouvellePartie(gestionnaireDePartieService,
            generateurDeGrilleService, specificationPartieRecu);

        client.emit(requetes.REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR_RAPPEL, specificationPartieRecu);
    }

    public joindrePartieMultijoueur(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
            generateurDeGrilleService: GenerateurDeGrilleService, requisPourJoindrePartieMultijoueur: RequisPourJoindrePartieMultijoueur,
            clients: SocketIO.Socket[]): void {
        requisPourJoindrePartieMultijoueur = RequisPourJoindrePartieMultijoueur.rehydrater(requisPourJoindrePartieMultijoueur);
        const partieEnAttente: Partie = gestionnaireDePartieService.obtenirPartieEnCours(requisPourJoindrePartieMultijoueur.guidPartie);
        const grille: Grille = partieEnAttente.obtenirGrilleComplete();
        partieEnAttente.ajouterJoueur(requisPourJoindrePartieMultijoueur.joueurAAjouter);

        requisPourJoindrePartieMultijoueur.specificationPartie = this.preparerEtDemarrerPartieEnAttente(partieEnAttente, grille);
        requisPourJoindrePartieMultijoueur.joueurs = partieEnAttente.obtenirJoueurs();

        for (const clientCourant of clients) {
            clientCourant.emit(requetes.REQUETE_SERVEUR_JOINDRE_PARTIE_RAPPEL, requisPourJoindrePartieMultijoueur);
        }
    }

    public preparerEtDemarrerPartieEnAttente(partieEnAttente: Partie, grille: Grille): SpecificationPartie {
        const specificationPartie: SpecificationPartie = new SpecificationPartie(partieEnAttente.obtenirNiveauGrille(),
            partieEnAttente.obtenirJoueurHote(), partieEnAttente.obtenirTypePartie());

        specificationPartie.etatPartie = EtatPartie.En_Cours;
        specificationPartie.indices = partieEnAttente.obtenirIndicesGrille();
        specificationPartie.specificationGrilleEnCours = new SpecificationGrille(
            grille.obtenirManipulateurCasesSansLettres(), grille.obtenirEmplacementsMot());

        specificationPartie.guidPartie = partieEnAttente.obtenirPartieGuid();
        partieEnAttente.demarrerPartie();

        return specificationPartie;
    }


    public preparerNouvellePartie(gestionnaireDePartieService: GestionnaireDePartieService,
            generateurDeGrilleService: GenerateurDeGrilleService, specificationPartieRecu: SpecificationPartie): SpecificationPartie {

        const grille: Grille = generateurDeGrilleService.genererGrilleMock(specificationPartieRecu.niveau);
        const guidPartie = gestionnaireDePartieService.creerPartie(specificationPartieRecu.joueur,
            specificationPartieRecu.typePartie, grille, grille.obtenirNiveau());

        let tableauIndices: Indice[] = new Array();
        tableauIndices = grille.motsComplet.recupererIndices();
        specificationPartieRecu.indices = tableauIndices;

        specificationPartieRecu.guidPartie = guidPartie;
        specificationPartieRecu.specificationGrilleEnCours = new SpecificationGrille(
            grille.obtenirManipulateurCasesSansLettres(), grille.obtenirEmplacementsMot());

        return specificationPartieRecu;
    }

    public verifierMot(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                       requisPourMotAVerifier: RequisPourMotAVerifier, clients: SocketIO.Socket[]): void {
        requisPourMotAVerifier = RequisPourMotAVerifier.rehydrater(requisPourMotAVerifier);
        const estLeMot = gestionnaireDePartieService.estLeMot(requisPourMotAVerifier.emplacementMot.obtenirCaseDebut(),
            requisPourMotAVerifier.emplacementMot.obtenirCaseFin(), requisPourMotAVerifier.motAVerifier,
            requisPourMotAVerifier.guidPartie, requisPourMotAVerifier.guidJoueur);

        if (estLeMot) {
            requisPourMotAVerifier.validerMot();
        }

        for (const clientCourant of clients) {
            clientCourant.emit(requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, requisPourMotAVerifier);
        }

        if (estLeMot) {
            const partieTermine = gestionnaireDePartieService.voirSiPartieTermine(requisPourMotAVerifier.guidPartie);
            if (partieTermine) {
                this.verifierEtAvertirSiPartieTermine(gestionnaireDePartieService, requisPourMotAVerifier.guidPartie, clients);
            }
        }
    }

    public changerEmplacementMotSelectionner(client: SocketIO.Socket, gestionnairePartieService: GestionnaireDePartieService,
                                             clientSocket: SocketIO.Socket[], requisPourSelectionnerMot: RequisPourSelectionnerMot): void {
        console.log('envoi');

        requisPourSelectionnerMot = RequisPourSelectionnerMot.rehydrater(requisPourSelectionnerMot);

        const partieEnCours: Partie = gestionnairePartieService.obtenirPartieEnCours(requisPourSelectionnerMot.guidPartie);

        partieEnCours.changerSelectionMot(requisPourSelectionnerMot.guidJoueur, requisPourSelectionnerMot.emplacementMot);
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CHANGER_EMPLACEMENT_MOT_SELECTIONNER, requisPourSelectionnerMot);

        for (const socketCourante of clientSocket) {
            console.log(clientSocket.length);
            console.log(socketCourante.client.conn.id);
            socketCourante.emit(requetes.REQUETE_CLIENT_ADVERSAIRE_CHANGER_EMPLACEMENT_MOT_SELECTIONNER, requisPourSelectionnerMot);
        }
    }

    public obtenirTempsRestant(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                               requisPourObtenirTempsRestant: RequisPourObtenirTempsRestant, clients: SocketIO.Socket[]): void {
        requisPourObtenirTempsRestant.tempsRestant = gestionnaireDePartieService
            .obtenirPartieEnCours(requisPourObtenirTempsRestant.guidPartie).obtenirTempsRestantMilisecondes();

        client.emit(requetes.REQUETE_CLIENT_OBTENIR_TEMPS_RESTANT_RAPPEL, requisPourObtenirTempsRestant);

        if (requisPourObtenirTempsRestant.tempsRestant === undefined) {
            this.verifierEtAvertirSiPartieTermine(gestionnaireDePartieService, requisPourObtenirTempsRestant.guidPartie, clients);
        }
    }

    public obtenirMotsTrouve(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                             requisPourMotsTrouve: RequisPourMotsTrouve, clients: SocketIO.Socket[]): void {
        const partie: Partie = gestionnaireDePartieService.obtenirPartieEnCours(requisPourMotsTrouve.guidPartie);

        requisPourMotsTrouve.motsTrouveSelonJoueur = partie.obtenirMotsTrouve();

        client.emit(requetes.REQUETE_CLIENT_OBTENIR_MOTS_TROUVE_RAPPEL, requisPourMotsTrouve);
    }

    public obtenirDemandeListePartiesEnCours(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                                             requisDemandeListePartieEnAttente: RequisDemandeListePartieEnAttente): void {

        const parties: Partie[] = gestionnaireDePartieService.obtenirPartiesEnAttente();
        let vuePartieCourante: VuePartieEnCours;

        for (const partieCourante of parties) {
            vuePartieCourante = new VuePartieEnCours();
            vuePartieCourante.guidPartie = partieCourante.obtenirPartieGuid();
            vuePartieCourante.niveau = partieCourante.obtenirNiveauGrille();
            vuePartieCourante.nomJoueurHote = partieCourante.obtenirJoueurHote().obtenirNomJoueur();
            requisDemandeListePartieEnAttente.listePartie.push(vuePartieCourante);
        }

        client.emit(requetes.REQUETE_CLIENT_DEMANDE_LISTE_PARTIES_EN_COURS_RAPPEL, requisDemandeListePartieEnAttente);
    }

    private verifierEtAvertirSiPartieTermine(gestionnaireDePartieService: GestionnaireDePartieService,
                                             guidPartie: string, clients: SocketIO.Socket[]) {
        const partieTermine = gestionnaireDePartieService.voirSiPartieTermine(guidPartie);
        if (partieTermine) {
            for (const clientCourant of clients) {
                clientCourant.emit(requetes.REQUETE_CLIENT_PARTIE_TERMINE, partieTermine);
            }
            console.log('partie terminee');
        }
    }
}
