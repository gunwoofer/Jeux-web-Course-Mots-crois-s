import { CreateurPisteService } from './../createurPiste/createurPiste.service';
import { DeplacementService } from './../deplacement/deplacement.service';
import { GestionnaireDeVue } from './../gestionnaireDeVue/gestionnaireDeVue.service';
import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
import { SkyboxService } from './../skybox/skybox.service';
import { LumiereService } from './../lumiere/lumiere.service';
import { JeuDeCourseService } from './../jeuDeCourse/jeudecourse.service';
import { MODE_JOUR_NUIT, MODE_FILTRE_COULEUR, ZOOM_AVANT, ZOOM_ARRIERE, CHANGER_VUE, ALLUMER_PHARES, RETROVISEUR } from './../constant';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { MoteurEditeurPiste } from '../moteurEditeurPiste/moteurediteurpiste.service';
import { FacadeCoordonneesService } from '../facadeCoordonnees/facadecoordonnees.service';
import { FacadePointService } from '../facadePoint/facadepoint.service';
import { FacadeLigneService } from '../facadeLigne/facadeLigne.service';
import { GestionnnairePartieService } from '../gestionnairePartie/gestionPartie.service';

const DUREE_CLIC_ANTIREBOND = 500;
const TYPE_POINT = 'Points';

@Injectable()
export class EvenementService {
  constructor(private renderService: MoteurEditeurPiste,
    private jeuDeCourseService: JeuDeCourseService,
    private gestionnaireDeVue: GestionnaireDeVue,
    private skyboxService: SkyboxService,
    private filtreCouleurService: FiltreCouleurService,
    private facadeCoordonneesService: FacadeCoordonneesService,
    private deplacementService: DeplacementService,
    private createurPisteService: CreateurPisteService,
    public gestionnnairePartieService: GestionnnairePartieService) { }

    private tempsMouseDown;
    private tempsMouseUp;
    private dureeClick;
    private modeGlissement;
    private pointHover;
    private objetGlisse;

  public onMouseDown(event: MouseEvent): void {
    this.tempsMouseDown = new Date().getTime();
    if (this.pointHover) {
      this.modeGlissement = true;
    }
  }

  public onMouseClick(event: MouseEvent): void {
    if (!this.modeGlissement || this.dureeClick < DUREE_CLIC_ANTIREBOND && this.objetGlisse && this.objetGlisse.name === '0') {
      this.createurPisteService.dessinerPoint(event, this.renderService.scene,
        this.renderService.obtenirCamera(), this.renderService.obtenirRenderer());
      this.renderService.actualiserDonnees();
      this.renderService.render();
    }

    this.modeGlissement = false;
  }

  public rightClick(): void {
    this.renderService.supprimerPoint();
    this.modeGlissement = false;
  }

  public onMouseUp(event: MouseEvent): void {
    this.tempsMouseUp = new Date().getTime();
    this.dureeClick = this.tempsMouseUp - this.tempsMouseDown;
    if (event.button === 0) {
      if (this.modeGlissement) {
        this.renderService.actualiserDonnees();
      }
    }
  }

  public onMouseMove(event: MouseEvent): void {
    this.facadeCoordonneesService.souris.mettreAJourVecteurSouris(event, this.renderService.obtenirRenderer());
    this.renderService.scene.updateMatrixWorld(true);
    const rayCaster = new THREE.Raycaster();
    rayCaster.setFromCamera(this.facadeCoordonneesService.souris.vecteurSouris, this.renderService.obtenirCamera());
    const intersects = rayCaster.intersectObjects(this.renderService.scene.children);
    if (this.modeGlissement) {
      this.dragPoint(intersects[0].point);
    } else {
      if (intersects.length > 0) {
        FacadePointService.actualiserCouleurPoints(this.createurPisteService.obtenirPoints());
        this.pointHover = false;
        for (const objet of intersects) {
          if (objet.object.type === TYPE_POINT) {
            this.hoverPoint(objet.object);
          }
        }
      }
    }
  }

  public gestionEvenement(event): void {
    if (event.key === MODE_JOUR_NUIT) {
      LumiereService.logiquePhares(this.gestionnnairePartieService.voitureDuJoueur);
      LumiereService.modeJourNuit(event, this.jeuDeCourseService.obtenirScene());
      LumiereService.jour = !LumiereService.jour;
      this.skyboxService.alternerSkybox(LumiereService.jour, this.jeuDeCourseService.obtenirCamera());
    } else if (event.key === MODE_FILTRE_COULEUR) {
      this.filtreCouleurService.mettreFiltre(event, this.jeuDeCourseService.obtenirScene());
    } else if (event.key === ZOOM_AVANT || event.key === ZOOM_ARRIERE) {
      this.gestionnaireDeVue.zoom(event, this.jeuDeCourseService.obtenirCamera());
    } else if (event.key === CHANGER_VUE) {
      this.gestionnnairePartieService.voitureDuJoueur.vueDessusTroisieme =
        !this.gestionnnairePartieService.voitureDuJoueur.vueDessusTroisieme;
    } else if (event.key === ALLUMER_PHARES) {
      LumiereService.phares = !LumiereService.phares;
      LumiereService.alternerPhares(this.gestionnnairePartieService.voitureDuJoueur);
      LumiereService.alternerPharesJoueurVirtuel(this.gestionnnairePartieService.voituresIA);
    } else if (event.key === RETROVISEUR) {
      this.gestionnaireDeVue.changerEtatRetroviseur();
    }
  }

  public toucheRelachee(event): void {
    this.deplacementService.toucheRelachee(event);
  }

  public touchePesee(event): void {
    this.deplacementService.touchePesee(event);
  }

  private dragPoint(position: any): void {
    this.objetGlisse.position.copy(position);
    const objetGlisseNumber = parseInt(this.objetGlisse.name, 10);
    FacadeLigneService.modifierLignePoints(
      objetGlisseNumber, this.objetGlisse.position, this.createurPisteService.pointsLine, this.createurPisteService.obtenirPoints()
    );
    if (objetGlisseNumber === 0 && this.createurPisteService.obtenirDessinTermine()) {
      this.createurPisteService.obtenirPoints()[
        this.renderService.facadePointService.compteur - 1].position.copy(this.objetGlisse.position);
      FacadeLigneService.modifierLignePoints(
        this.renderService.facadePointService.compteur - 1,
        this.objetGlisse.position,
        this.createurPisteService.pointsLine,
        this.createurPisteService.obtenirPoints()
      );
    }
  }

  private hoverPoint(point): void {
    this.pointHover = true;
    this.objetGlisse = point;
    point.material.color.set(0x0000ff);
    point.material.size = 11;
  }
}
