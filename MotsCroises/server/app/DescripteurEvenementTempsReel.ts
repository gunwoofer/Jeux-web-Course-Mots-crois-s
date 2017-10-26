import * as requetes from '../../commun/constantes/RequetesTempsReel';
import { Grille } from './Grille';
import { Partie } from './Partie';
import { SpecificationPartie } from '../../commun/SpecificationPartie';
import { RequisPourMotAVerifier } from '../../commun/requis/RequisPourMotAVerifier';
import { RequisPourSelectionnerMot } from '../../commun/requis/RequisPourSelectionnerMot';
import { SpecificationGrille } from './../../commun/SpecificationGrille';
import { Indice } from './Indice';
import { GestionnaireDePartieService } from './GestionnaireDePartieService';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';
import { RequisPourObtenirTempsRestant } from '../../commun/requis/RequisPourObtenirTempsRestant';

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
        const specificationPartieRecu: SpecificationPartie = SpecificationPartie.rehydrater(specificationPartie);
        const grille: Grille = generateurDeGrilleService.genererGrilleMock(specificationPartieRecu.niveau);
        const guidPartie = gestionnaireDePartieService.creerPartie(specificationPartieRecu.joueur,
            specificationPartieRecu.typePartie, grille, grille.obtenirNiveau());

        let tableauIndices: Indice[] = new Array();
        tableauIndices = grille.motsComplet.recupererIndices();
        specificationPartieRecu.indices = tableauIndices;

        specificationPartieRecu.guidPartie = guidPartie;
        specificationPartieRecu.specificationGrilleEnCours = new SpecificationGrille(
            grille.obtenirManipulateurCasesSansLettres(), grille.obtenirEmplacementsMot());

        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, specificationPartieRecu);
    }

    public verifierMot(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService, 
        requisPourMotAVerifier: RequisPourMotAVerifier): void {
        requisPourMotAVerifier = RequisPourMotAVerifier.rehydrater(requisPourMotAVerifier);
        const estLeMot = gestionnaireDePartieService.estLeMot(requisPourMotAVerifier.emplacementMot.obtenirCaseDebut(),
            requisPourMotAVerifier.emplacementMot.obtenirCaseFin(), requisPourMotAVerifier.motAVerifier,
            requisPourMotAVerifier.guidPartie, requisPourMotAVerifier.guidJoueur);

        if (estLeMot) {
            requisPourMotAVerifier.validerMot();
        }

        client.emit(requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, requisPourMotAVerifier);

        if (estLeMot) {
            const partieTermine = gestionnaireDePartieService.voirSiPartieTermine(requisPourMotAVerifier.guidPartie);
            if (partieTermine) {
                client.emit(requetes.REQUETE_CLIENT_PARTIE_TERMINE, partieTermine);
                console.log('partie terminee');
            }
        }
    }

    public changerEmplacementMotSelectionner(client: SocketIO.Socket, gestionnairePartieService: GestionnaireDePartieService, 
        clientSocket: SocketIO.Socket[], requisPourSelectionnerMot: RequisPourSelectionnerMot): void {
        requisPourSelectionnerMot = RequisPourSelectionnerMot.rehydrater(requisPourSelectionnerMot);

        const partieEnCours: Partie = gestionnairePartieService.obtenirPartieEnCours(requisPourSelectionnerMot.guidPartie);

        partieEnCours.changerSelectionMot(requisPourSelectionnerMot.guidJoueur, requisPourSelectionnerMot.emplacementMot);
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CHANGER_EMPLACEMENT_MOT_SELECTIONNER, requisPourSelectionnerMot);

        for (const socketCourante of clientSocket) {
            if (this.estUnAdversaire(client, socketCourante)) {
                client.emit(requetes.REQUETE_CLIENT_ADVERSAIRE_CHANGER_EMPLACEMENT_MOT_SELECTIONNER, requisPourSelectionnerMot);
            }
        }
    }

    public obtenirTempsRestant(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                                requisPourObtenirTempsRestant: RequisPourObtenirTempsRestant): void {
        requisPourObtenirTempsRestant.tempsRestant = gestionnaireDePartieService
            .obtenirPartieEnCours(requisPourObtenirTempsRestant.guidPartie).obtenirTempsRestantMilisecondes();

        client.emit(requetes.REQUETE_CLIENT_OBTENIR_TEMPS_RESTANT_RAPPEL, requisPourObtenirTempsRestant);
    }

    private estUnAdversaire(clientEmetteur: SocketIO.Socket, clientCourant: SocketIO.Socket): boolean {
        return (clientEmetteur.id === clientCourant.id) ? false : true;
    }
}
