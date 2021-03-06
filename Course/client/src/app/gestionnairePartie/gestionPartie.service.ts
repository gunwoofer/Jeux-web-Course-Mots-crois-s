import { FonctionMaths } from './../fonctionMathematiques';
import { IObservateur } from './../../../../commun/observateur/Observateur';
import { Retroviseur } from './../gestionnaireDeVue/retroviseur';
import { AffichageTeteHauteService } from './../affichageTeteHaute/affichagetetehaute.service';
import { TableauScoreService } from './../tableauScore/tableauScoreService.service';
import { EtatPartie } from './../partie/EtatPartie';
import { NotificationType } from './../../../../commun/observateur/NotificationType';
import { ISujet } from './../../../../commun/observateur/Sujet';
import { MusiqueService } from './../musique/musique.service';
import { Partie } from './../partie/Partie';
import { LigneArrivee } from './../partie/LigneArrivee';
import { Pilote } from './../partie/Pilote';
import { MondeDuJeuService } from './../mondedujeu/mondedujeu.service';
import { ObjetService } from './../objetService/objet.service';
import {
    TABLEAU_POSITION, EMPLACEMENT_VOITURE, DUREE_STINGER_MILISECONDES,
    MILLE, COULEUR_VOITURE_JOUEUR_VIRTUEL, COULEUR_VOITURE_JOUEUR, NOMBRE_DE_TOURS_PARTIE_MINIMAL
} from './../constant';
import * as THREE from 'three';
import { Injectable, EventEmitter } from '@angular/core';
import { Voiture } from '../voiture/Voiture';

@Injectable()
export class GestionnnairePartieService implements IObservateur {


    public voitureDuJoueur: Voiture;
    public emetteurEvenement = new EventEmitter<boolean>();
    public voituresIA: Voiture[] = [];
    public partie: Partie;
    public retroviseur: Retroviseur;
    public nombreTours = NOMBRE_DE_TOURS_PARTIE_MINIMAL;


    constructor(private tableauScoreService: TableauScoreService,
        private mondeDuJeuService: MondeDuJeuService, private musiqueService: MusiqueService,
        private affichageTeteHauteService: AffichageTeteHauteService) { }

    public chargementDesVoitures(scene: THREE.Scene, container: HTMLDivElement): void {
        const nombreAleatoire = FonctionMaths.caseAleatoireTableauPosition();
        this.chargerVoitureJoueur(TABLEAU_POSITION[nombreAleatoire][0], TABLEAU_POSITION[nombreAleatoire][1], scene, container);
        TABLEAU_POSITION.splice(nombreAleatoire, 1);
        for (let i = 0; i < TABLEAU_POSITION.length; i++) {
            this.chargerVoitureJoueurVirtuel(TABLEAU_POSITION[i][0], TABLEAU_POSITION[i][1], scene);
        }
    }

    private chargerVoitureJoueur(cadranX: number, cadranY: number, scene: THREE.Scene, container: HTMLDivElement): void {
        new THREE.ObjectLoader().load(EMPLACEMENT_VOITURE, (obj: THREE.Object3D) => {
            this.configurationVoitureJoueur(cadranX, cadranY, obj, container);
            scene.add(obj);
        });
    }

    private chargerVoitureJoueurVirtuel(cadranX: number, cadranY: number, scene: THREE.Scene): void {
        new THREE.ObjectLoader().load(EMPLACEMENT_VOITURE, (obj: THREE.Object3D) => {
            this.configurationVoitureJoueurVirtuel(cadranX, cadranY, obj, scene);
        });
    }

    private configurationVoitureJoueur(cadranX: number, cadranY: number, objet: THREE.Object3D, container: HTMLDivElement): void {
        ObjetService.manipulationObjetVoiture(this.mondeDuJeuService.segment, objet, COULEUR_VOITURE_JOUEUR);
        this.voitureDuJoueur = new Voiture(objet, this.mondeDuJeuService.piste);
        ObjetService.calculePositionObjetVoiture(cadranX, cadranY, this.voitureDuJoueur, this.mondeDuJeuService.segment);
        this.retroviseur = new Retroviseur(container, this.voitureDuJoueur);
        this.preparerPartie();
        this.partie.demarrerPartie();
    }

    private configurationVoitureJoueurVirtuel(cadranX: number, cadranY: number, objet: THREE.Object3D, scene: THREE.Scene): void {
        ObjetService.manipulationObjetVoiture(this.mondeDuJeuService.segment, objet, COULEUR_VOITURE_JOUEUR_VIRTUEL);
        this.voituresIA.push(new Voiture(objet, this.mondeDuJeuService.piste));
        this.voituresIA[this.voituresIA.length - 1].ajouterIndicateursVoitureScene(scene);
        ObjetService.calculePositionObjetVoiture(cadranX, cadranY, this.voituresIA[this.voituresIA.length - 1],
            this.mondeDuJeuService.segment);
        scene.add(objet);
    }

    private preparerPartie(): void {
        const pilote: Pilote = new Pilote(this.voitureDuJoueur, true);
        const ligneArrivee: LigneArrivee = new LigneArrivee(this.mondeDuJeuService.segment.premierSegment[1],
            this.mondeDuJeuService.segment.premierSegment[3], this.mondeDuJeuService.segment.damierDeDepart);
        const pilotes: Pilote[] = [pilote];
        this.partie = new Partie(pilotes, ligneArrivee, this.nombreTours,
            [this.musiqueService.musique, this], [this.affichageTeteHauteService]);
        this.affichageTeteHauteService.mettreAJourAffichage(pilotes.length, this.nombreTours);
        Partie.toursAComplete = this.nombreTours;
    }

    public notifier(sujet: ISujet, type: NotificationType): void {
        if (type === NotificationType.Non_definie) {
            if (this.partie.etatPartie === EtatPartie.Termine) {
                setTimeout(() => {
                    this.tableauScoreService.temps = (Pilote.tempsTotal / MILLE);
                    this.tableauScoreService.finPartie = true;
                    this.emetteurEvenement.emit(true);
                }, DUREE_STINGER_MILISECONDES);
            }
        }
    }
}
