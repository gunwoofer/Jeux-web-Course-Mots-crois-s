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
import { TABLEAU_POSITION, EMPLACEMENT_VOITURE, NOMBRE_DE_TOURS_PARTIE_DEFAUT, DUREE_STINGER_MILISECONDES, 
    RESULTAT_PARTIE } from './../constant';
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
        private affichageTeteHauteService: AffichageTeteHauteService) {}

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
        const nombreAleatoire = Math.round(Math.random() * 3);
        this.chargerVoiture(TABLEAU_POSITION[nombreAleatoire][0], TABLEAU_POSITION[nombreAleatoire][1], true, scene, container);
        TABLEAU_POSITION.splice(nombreAleatoire, 1);
        for (let i = 0; i < TABLEAU_POSITION.length; i++) {
            this.chargerVoiture(TABLEAU_POSITION[i][0], TABLEAU_POSITION[i][1], false, scene, container);
        }
    }

    public chargerVoiture(cadranX: number, cadranY: number, joueur: boolean, scene: THREE.Scene, container: HTMLDivElement): void {
        const loader = new THREE.ObjectLoader();
        loader.load(EMPLACEMENT_VOITURE, (obj) => {
            this.objetService.manipulationObjetVoiture(this.mondeDuJeuService.segment.premierSegment[1],
                                                        this.mondeDuJeuService.segment.premierSegment[0], obj);
            this.configurationVoiturePiste(cadranX, cadranY, obj, joueur, container, scene);
            scene.add(obj);
        });
    }

    public configurationVoiturePiste(cadranX: number, cadranY: number, 
        obj: THREE.Object3D, joueur: boolean, container: HTMLDivElement, scene: THREE.Scene): void {
        let meshPrincipalVoiture: any;
        meshPrincipalVoiture = obj.getObjectByName('MainBody');
        if (joueur) {
            meshPrincipalVoiture.material.color.set('grey');
            this.voitureDuJoueur = new Voiture(obj, this.mondeDuJeuService.piste);
            this.calculePositionVoiture(cadranX, cadranY, this.voitureDuJoueur);
            this.retroviseur = new Retroviseur(container, this.voitureDuJoueur);
            this.preparerPartie();
            this.partie.demarrerPartie();
        } else {
            meshPrincipalVoiture.material.color.set('black');
            this.voituresIA.push(new Voiture(obj, this.mondeDuJeuService.piste));
            this.voituresIA[this.voituresIA.length - 1].ajouterIndicateursVoitureScene(scene);
            this.calculePositionVoiture(cadranX, cadranY, this.voituresIA[this.voituresIA.length - 1]);
        }
    }

    public calculePositionVoiture(cadranX: number, cadranY: number, voiture: Voiture) {
        voiture.voiture3D.position.set(
            PlacementService.calculPositionVoiture(cadranX, cadranY, this.mondeDuJeuService.segment.premierSegment).x,
            PlacementService.calculPositionVoiture(cadranX, cadranY, this.mondeDuJeuService.segment.premierSegment).y, 0);
    }

    public logiquePhares(voiture: Voiture): void {
        if (!LumiereService.phares && LumiereService.jour) {
            LumiereService.phares = !LumiereService.phares;
            LumiereService.alternerPhares(voiture);
        } else if (LumiereService.phares && !LumiereService.jour) {
            LumiereService.phares = !LumiereService.phares;
            LumiereService.alternerPhares(voiture);
        }
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
        this.tableauScoreService.temps = (Pilote.tempsTotal / 1000);
        this.tableauScoreService.finPartie = true;
        this.routeur.navigateByUrl(RESULTAT_PARTIE);
    }

}