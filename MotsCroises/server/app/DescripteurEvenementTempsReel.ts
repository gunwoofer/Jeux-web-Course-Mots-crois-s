import { MotComplet } from './MotComplet';
import { RequisPourMotsComplets } from './../../commun/requis/RequisPourMotsComplets';
import * as requetes from '../../commun/constantes/RequetesTempsReel';
import {Grille} from './Grille';
import {Partie} from './Partie';
import {SpecificationPartie} from '../../commun/SpecificationPartie';
import {RequisPourMotAVerifier} from '../../commun/requis/RequisPourMotAVerifier';
import {RequisPourSelectionnerMot} from '../../commun/requis/RequisPourSelectionnerMot';
import {SpecificationGrille} from './../../commun/SpecificationGrille';
import {GestionnaireDePartieService} from './GestionnaireDePartieService';
import {RequisPourObtenirTempsRestant} from '../../commun/requis/RequisPourObtenirTempsRestant';
import {RequisPourMotsTrouve} from '../../commun/requis/RequisPourMotsTrouve';
import {RequisDemandeListePartieEnAttente} from '../../commun/requis/RequisDemandeListePartieEnAttente';
import {VuePartieEnCours} from '../../commun/VuePartieEnCours';
import {RequisPourJoindrePartieMultijoueur} from '../../commun/requis/RequisPourJoindrePartieMultijoueur';
import {EtatPartie} from '../../commun/EtatPartie';
import {RequisPourModifierTempsRestant} from '../../commun/requis/RequisPourModifierTempsRestant';
import { GenerateurDeGrilleService } from './GenerateurDeGrilleService';

export class DescripteurEvenementTempsReel {
    public quitter(client: SocketIO.Socket, io: any): void {
        client.emit(requetes.REQUETE_CLIENT_MESSAGE, 'Client a quitte');
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_QUITTER, 'client_deconnecte');
        io.close();
    }

    public envoyer(messageClient: string, client: SocketIO.Socket): void {
        client.emit(requetes.REQUETE_CLIENT_MESSAGE, 'Bonjour du serveur.');
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CONNEXION, 'Client a été ajouté.');
    }

    public creerPartieSolo(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                            generateurDeGrilleService: GenerateurDeGrilleService, specificationPartie: SpecificationPartie): void {
        this.preparerNouvellePartie(gestionnaireDePartieService,
            generateurDeGrilleService, SpecificationPartie.rehydrater(specificationPartie)).then((specificationPartieNouvellePartie) => {
                gestionnaireDePartieService.obtenirPartieEnCours(specificationPartieNouvellePartie.guidPartie).demarrerPartie();
                client.emit(requetes.REQUETE_CLIENT_RAPPEL_CREER_PARTIE_SOLO, specificationPartieNouvellePartie);
            });
    }

    public creerPartieMultijoueur(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                                  generateurDeGrilleService: GenerateurDeGrilleService, specificationPartie: SpecificationPartie): void {
        this.preparerNouvellePartie(gestionnaireDePartieService,
            generateurDeGrilleService, SpecificationPartie.rehydrater(specificationPartie)).then((specificationPartieNouvellePartie) => {
                client.emit(requetes.REQUETE_SERVEUR_CREER_PARTIE_MULTIJOUEUR_RAPPEL, specificationPartieNouvellePartie);
            });
    }

    public joindrePartieMultijoueur(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                                    generateurDeGrilleService: GenerateurDeGrilleService,
                                    requisPourJoindrePartieMultijoueur: RequisPourJoindrePartieMultijoueur,
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

    public async preparerNouvellePartie(gestionnaireDePartieService: GestionnaireDePartieService,
                                        generateurDeGrilleService: GenerateurDeGrilleService,
                                        specificationPartieRecu: SpecificationPartie): Promise<SpecificationPartie> {
        const grille: Grille = await generateurDeGrilleService.genererGrille(specificationPartieRecu.niveau);
        specificationPartieRecu.indices = grille.motsComplet.recupererIndices();
        specificationPartieRecu.guidPartie = gestionnaireDePartieService.creerPartie(specificationPartieRecu.joueur,
            specificationPartieRecu.typePartie, grille, grille.niveau);
        specificationPartieRecu.specificationGrilleEnCours = new SpecificationGrille(
            grille.obtenirManipulateurCasesSansLettres(), grille.obtenirEmplacementsMot());
        return specificationPartieRecu;
    }

    public verifierMot(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                       requisPourMotAVerifier: RequisPourMotAVerifier, clients: SocketIO.Socket[]): void {
        requisPourMotAVerifier = RequisPourMotAVerifier.rehydrater(requisPourMotAVerifier);
        const estLeMot = gestionnaireDePartieService.estLeMot(requisPourMotAVerifier);
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
        requisPourSelectionnerMot = RequisPourSelectionnerMot.rehydrater(requisPourSelectionnerMot);
        gestionnairePartieService.obtenirPartieEnCours(requisPourSelectionnerMot.guidPartie)
                                 .changerSelectionMot(requisPourSelectionnerMot.guidJoueur, requisPourSelectionnerMot.emplacementMot);
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_CHANGER_EMPLACEMENT_MOT_SELECTIONNER, requisPourSelectionnerMot);
        for (const socketCourante of clientSocket) {
            if (this.estUnAdversaire(client, socketCourante)) {
                socketCourante.emit(requetes.REQUETE_CLIENT_ADVERSAIRE_CHANGER_EMPLACEMENT_MOT_SELECTIONNER, requisPourSelectionnerMot);
            }
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

    public modifierTempsRestant(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                               requisPourModifierTempsRestant: RequisPourModifierTempsRestant, clients: SocketIO.Socket[]): void {
        gestionnaireDePartieService.obtenirPartieEnCours(requisPourModifierTempsRestant.guidPartie)
                                    .demarrerPartie(requisPourModifierTempsRestant.tempsRestant);
        this.obtenirTempsRestant(client, gestionnaireDePartieService,
                                new RequisPourObtenirTempsRestant(requisPourModifierTempsRestant.guidPartie), clients);
    }

    public obtenirMotsTrouve(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                             requisPourMotsTrouve: RequisPourMotsTrouve, clients: SocketIO.Socket[]): void {
        requisPourMotsTrouve.motsTrouveSelonJoueur = gestionnaireDePartieService.obtenirPartieEnCours(requisPourMotsTrouve.guidPartie)
                                                                                .obtenirMotsTrouve();
        client.emit(requetes.REQUETE_CLIENT_OBTENIR_MOTS_TROUVE_RAPPEL, requisPourMotsTrouve);
    }

    public obtenirDemandeListePartiesEnCours(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                                             requisDemandeListePartieEnAttente: RequisDemandeListePartieEnAttente): void {
        let vuePartieCourante: VuePartieEnCours;
        for (const partieCourante of gestionnaireDePartieService.obtenirPartiesEnAttente()) {
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
        }
    }

    public obtenirMotsComplets(client: SocketIO.Socket, gestionnaireDePartieService: GestionnaireDePartieService,
                                            requisPourMotsComplets: RequisPourMotsComplets): void {
        const listeMots: MotComplet[] = gestionnaireDePartieService.obtenirPartieEnCours(requisPourMotsComplets.guidPartie)
                .obtenirGrille().mots;
        requisPourMotsComplets = RequisPourMotsComplets.rehydrater(requisPourMotsComplets);
        requisPourMotsComplets.remplirListeMotComplets(listeMots);
        client.emit(requetes.REQUETE_CLIENT_RAPPEL_OBTENIR_MOTS_COMPLETS_CHEAT_MODE, requisPourMotsComplets);
    }

    private estUnAdversaire(clientEmetteur: SocketIO.Socket, clientCourant: SocketIO.Socket): boolean {
        return (clientEmetteur.id === clientCourant.id) ? false : true;
    }
}
