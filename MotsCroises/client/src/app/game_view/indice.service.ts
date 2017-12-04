import {Injectable} from '@angular/core';
import {GameViewService} from './game-view.service';
import {IndiceMot} from '../indice/indiceMot';
import {RequisPourMotsComplets} from '../../../../commun/requis/RequisPourMotsComplets';
import * as requetes from '../../../../commun/constantes/RequetesTempsReel';
import {Subject} from 'rxjs/Subject';
import {RequisPourSelectionnerMot} from '../../../../commun/requis/RequisPourSelectionnerMot';
import {EmplacementMot} from '../../../../commun/EmplacementMot';
import {Indice} from '../../../../server/app/indice';

const PAS_DE_DEFINITION = 'No definition';


@Injectable()
export class IndiceService {
    private indiceSelectionne = new Subject<IndiceMot>();
    public indiceSelectionne$ = this.indiceSelectionne.asObservable();
    private indiceAdversaireSelectionne = new Subject<IndiceMot>();
    public indiceAdversaireSelectionne$ = this.indiceAdversaireSelectionne.asObservable();
    private indiceAdversaire: IndiceMot;
    public indices: IndiceMot[];


    constructor(private gameViewService: GameViewService) {
    }

    public demanderMotsComplets() {
        const requisPourMotsComplets = new RequisPourMotsComplets(this.gameViewService.specificationPartie.guidPartie);
        this.gameViewService.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourMotsComplets>(
            requetes.REQUETE_SERVER_OBTENIR_MOTS_COMPLETS_CHEAT_MODE,
            requisPourMotsComplets, requetes.REQUETE_CLIENT_RAPPEL_OBTENIR_MOTS_COMPLETS_CHEAT_MODE,
            this.recevoirMotsComplets,
            this);
    }

    public recevoirMotsComplets(requisPourMotsComplets: RequisPourMotsComplets, self: IndiceService) {
        for (let i = 0; i < self.indices.length; i++) {
            self.indices[i].definition = requisPourMotsComplets.listeMotComplet[i].lettres;
        }
    }

    public changementSelectionMot(): void {
        const requisPourSelectionnerMot = new RequisPourSelectionnerMot(this.gameViewService.emplacementMot,
            this.gameViewService.joueur.obtenirGuid(), this.gameViewService.specificationPartie.guidPartie);
        this.gameViewService.connexionTempsReelClient.envoyerRecevoirRequete<RequisPourSelectionnerMot>(
            requetes.REQUETE_SERVEUR_CHANGER_EMPLACEMENT_MOT_SELECTIONNER,
            requisPourSelectionnerMot, requetes.REQUETE_CLIENT_ADVERSAIRE_CHANGER_EMPLACEMENT_MOT_SELECTIONNER,
            this.rappelChangementSelectionIndiceAdversaire, this);
    }

    public ecouterChangementSelectionMotAdversaire<RequisPourSelectionnerMot>(): void {
        this.gameViewService.connexionTempsReelClient.ecouterRequete<RequisPourSelectionnerMot>(
            requetes.REQUETE_CLIENT_ADVERSAIRE_CHANGER_EMPLACEMENT_MOT_SELECTIONNER, this.rappelChangementSelectionIndiceAdversaire, this
        );
    }

    /*public ecouterRetourMot<RequisPourMotAVerifier>(): void {
        this.gameViewService.connexionTempsReelClient.ecouterRequete<RequisPourMotAVerifier>
        (requetes.REQUETE_CLIENT_RAPPEL_VERIFIER_MOT, this.recupererVerificationMot, this);
    }*/

    private rappelChangementSelectionIndiceAdversaire(requisPourSelectionnerMot: RequisPourSelectionnerMot, self: IndiceService) {
        requisPourSelectionnerMot = RequisPourSelectionnerMot.rehydrater(requisPourSelectionnerMot);
        self.indiceAdversaire = self.gameViewService.trouverIndiceMotAvecGuid(requisPourSelectionnerMot.emplacementMot.GuidIndice, self.indices);
        self.mettreAJourSelectionAdversaire(self.indiceAdversaire);
    }


    public mettreAJourSelectionAdversaire(indice: IndiceMot) {
        this.indiceAdversaireSelectionne.next(indice);
    }

    public afficherSelectionIndice(indice: IndiceMot) {
        if (indice) {
            this.gameViewService.emplacementMot = this.gameViewService.trouverEmplacementMotAvecGuid(indice.guidIndice);
            this.indiceSelectionne.next(indice);
            this.changementSelectionMot();
        } else {
            this.gameViewService.emplacementMot = null;
            this.indiceSelectionne.next();
        }
    }

    private trouverIndiceAvecGuidEmplacementMot(guid: string): Indice {
        for (const indiceServeur of this.gameViewService.specificationPartie.indices) {
            if (indiceServeur.id === guid) {
                return indiceServeur;
            }
        }
        return null;
    }

    public MAJIndices(): void {
        const indices: IndiceMot[] = [];
        for (const emplacementMot of this.gameViewService.specificationPartie.specificationGrilleEnCours.emplacementMots) {
            const indiceServeur: Indice = this.trouverIndiceAvecGuidEmplacementMot(emplacementMot.obtenirGuidIndice());
            let definition: string;
            if (indiceServeur.definitions !== undefined) {
                definition = indiceServeur.definitions[0];
            } else {
                definition = PAS_DE_DEFINITION;
            }
            indices.push(new IndiceMot(emplacementMot, definition));
        }
        this.indices = indices;
        this.gameViewService.indices = this.indices;
    }
}
