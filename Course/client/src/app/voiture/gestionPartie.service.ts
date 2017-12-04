import { FonctionMaths } from './../fonctionMathematiques';
import { Observateur } from './../../../../commun/observateur/Observateur';
import { Retroviseur } from './../gestionnaireDeVue/retroviseur';
import { AffichageTeteHaute } from './../affichageTeteHaute/affichageTeteHaute';
import { AffichageTeteHauteService } from './../affichageTeteHaute/affichagetetehaute.service';
import { Router } from '@angular/router';
import { TableauScoreService } from './../tableauScore/tableauScoreService.service';
import { EtatPartie } from './../partie/EtatPartie';
import { NotificationType } from './../../../../commun/observateur/NotificationType';
import { Sujet } from './../../../../commun/observateur/Sujet';
import { MusiqueService } from './../musique/musique.service';
import { Partie } from './../partie/Partie';
import { LigneArrivee } from './../partie/LigneArrivee';
import { Pilote } from './../partie/Pilote';
import { MondeDuJeuService } from './../mondedujeu/mondedujeu.service';
import { ObjetService } from './../objetService/objet.service';
import {
    TABLEAU_POSITION, EMPLACEMENT_VOITURE, NOMBRE_DE_TOURS_PARTIE_DEFAUT, DUREE_STINGER_MILISECONDES,
    RESULTAT_PARTIE, MILLE, COULEUR_VOITURE_JOUEUR_VIRTUEL, COULEUR_VOITURE_JOUEUR
} from './../constant';
import { PlacementService } from './../objetService/placementVoiture.service';
import { Injectable } from '@angular/core';
import { LumiereService } from '../lumiere/lumiere.service';
import { Voiture } from './Voiture';
import * as THREE from 'three';

@Injectable()

export class GestionPartieService implements Observateur {


    public voitureDuJoueur: Voiture;
    public voituresIA: Voiture[] = [];
    public partie: Partie;
    public retroviseur: Retroviseur;
    public nombreTours = NOMBRE_DE_TOURS_PARTIE_DEFAUT;


    constructor(private objetService: ObjetService, private tableauScoreService: TableauScoreService, private routeur: Router,
        private mondeDuJeuService: MondeDuJeuService, private musiqueService: MusiqueService,
        private affichageTeteHauteService: AffichageTeteHauteService) { }

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

    public chargementDesVoitures(scene: THREE.Scene, container: HTMLDivElement): void {
        const nombreAleatoire = FonctionMaths.caseAleatoireTableauPosition();
        this.chargerVoitureJoueur(TABLEAU_POSITION[nombreAleatoire][0], TABLEAU_POSITION[nombreAleatoire][1], scene, container);
        TABLEAU_POSITION.splice(nombreAleatoire, 1);
        for (let i = 0; i < TABLEAU_POSITION.length; i++) {
            this.chargerVoitureJoueurVirtuel(TABLEAU_POSITION[i][0], TABLEAU_POSITION[i][1], scene);
        }
    }

    public chargerVoitureJoueur(cadranX: number, cadranY: number, scene: THREE.Scene, container: HTMLDivElement): void {
        new THREE.ObjectLoader().load(EMPLACEMENT_VOITURE, (obj: THREE.Object3D) => {
            this.configurationVoitureJoueur(cadranX, cadranY, obj, container);
            scene.add(obj);
        });
    }

    public chargerVoitureJoueurVirtuel(cadranX: number, cadranY: number, scene: THREE.Scene): void {
        new THREE.ObjectLoader().load(EMPLACEMENT_VOITURE, (obj: THREE.Object3D) => {
            this.configurationVoitureJoueurVirtuel(cadranX, cadranY, obj, scene);
        });
    }

    public configurationVoitureJoueur(cadranX: number, cadranY: number, objet: THREE.Object3D, container: HTMLDivElement): void {
        ObjetService.manipulationObjetVoiture(this.mondeDuJeuService.segment, objet, COULEUR_VOITURE_JOUEUR);
        this.voitureDuJoueur = new Voiture(objet, this.mondeDuJeuService.piste);
        ObjetService.calculePositionObjetVoiture(cadranX, cadranY, this.voitureDuJoueur, this.mondeDuJeuService.segment);
        this.retroviseur = new Retroviseur(container, this.voitureDuJoueur);
        this.preparerPartie();
        this.partie.demarrerPartie();
    }

    public configurationVoitureJoueurVirtuel(cadranX: number, cadranY: number, objet: THREE.Object3D, scene: THREE.Scene): void {
        ObjetService.manipulationObjetVoiture(this.mondeDuJeuService.segment, objet, COULEUR_VOITURE_JOUEUR_VIRTUEL);
        this.voituresIA.push(new Voiture(objet, this.mondeDuJeuService.piste));
        this.voituresIA[this.voituresIA.length - 1].ajouterIndicateursVoitureScene(scene);
        ObjetService.calculePositionObjetVoiture(cadranX, cadranY, this.voituresIA[this.voituresIA.length - 1],
            this.mondeDuJeuService.segment);
        scene.add(objet);
    }

    public notifier(sujet: Sujet, type: NotificationType): void {
        if (type === NotificationType.Non_definie) {
            if (this.partie.etatPartie === EtatPartie.Termine) {
                setTimeout(() => {
                    this.voirPageFinPartie();
                }, DUREE_STINGER_MILISECONDES);
            }
        }
    }

    private voirPageFinPartie(): void {
        this.tableauScoreService.temps = (Pilote.tempsTotal / MILLE);
        this.tableauScoreService.finPartie = true;
        this.routeur.navigateByUrl(RESULTAT_PARTIE);
    }

}
