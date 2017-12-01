import { GestionnaireDeVue } from './../gestionnaireDeVue/gestionnaireDeVue.service';
import { FiltreCouleurService } from '../filtreCouleur/filtreCouleur.service';
import { SkyboxService } from './../skybox/skybox.service';
import { LumiereService } from './../lumiere/lumiere.service';
import { GenerateurPisteService } from './../generateurPiste/generateurpiste.service';
import { MODE_JOUR_NUIT, MODE_FILTRE_COULEUR, ZOOM_AVANT, ZOOM_ARRIERE, CHANGER_VUE, ALLUMER_PHARES, RETROVISEUR } from './../constant';
import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { RenderService } from '../renderService/render.service';
import { FacadeCoordonneesService } from '../facadeCoordonnees/facadecoordonnees.service';
import { FacadePointService } from '../facadePoint/facadepoint.service';
import { FacadeLigneService } from '../facadeLigne/facadeLigne.service';

@Injectable()
export class EvenementService {
  constructor(private renderService: RenderService, private generateurPisteService: GenerateurPisteService,
    private gestionnaireDeVue: GestionnaireDeVue, private lumiereService: LumiereService, private skyboxService: SkyboxService,
    private filtreCouleurService: FiltreCouleurService, private facadeCoordonneesService: FacadeCoordonneesService) {}

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
    if (!this.modeGlissement || this.dureeClick < 500 && this.objetGlisse && this.objetGlisse.name === '0') {
      this.renderService.dessinerPoint(event);
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
    const rayCaster = new THREE.Raycaster();
    this.facadeCoordonneesService.souris.mettreAJourVecteurSouris(event, this.renderService.renderer);
    let intersects;
    this.renderService.scene.updateMatrixWorld(true);
    rayCaster.setFromCamera(this.facadeCoordonneesService.souris.vecteurSouris, this.renderService.camera);
    intersects = rayCaster.intersectObjects(this.renderService.scene.children);
    if (this.modeGlissement) {
      this.dragPoint(intersects[0].point);
    } else {
      if (intersects.length > 0) {
        FacadePointService.actualiserCouleurPoints(this.renderService.points);
        this.pointHover = false;
        for (const objet of intersects) {
          if (objet.object.type === 'Points') {
            this.hoverPoint(objet.object);
          }
        }
      }
    }
  }

  public gestionEvenement(event): void {
    if (event.key === MODE_JOUR_NUIT) {
      this.generateurPisteService.logiquePhares();
      this.lumiereService.modeJourNuit(event, this.generateurPisteService.scene);
      this.generateurPisteService.jour = !this.generateurPisteService.jour;
      this.skyboxService.alternerSkybox(this.generateurPisteService.jour,
        this.generateurPisteService.camera, this.generateurPisteService.listeSkyboxJour, this.generateurPisteService.listeSkyboxNuit);
    } else if (event.key === MODE_FILTRE_COULEUR) {
      this.filtreCouleurService.mettreFiltre(event, this.generateurPisteService.scene);
    } else if (event.key === ZOOM_AVANT || event.key === ZOOM_ARRIERE) {
      this.gestionnaireDeVue.zoom(event, this.generateurPisteService.camera);
    } else if (event.key === CHANGER_VUE) {
      this.generateurPisteService.voitureDuJoueur.vueDessusTroisieme = !this.generateurPisteService.voitureDuJoueur.vueDessusTroisieme;
    } else if (event.key === ALLUMER_PHARES) {
      this.generateurPisteService.phares = !this.generateurPisteService.phares;
      this.lumiereService.alternerPhares(this.generateurPisteService.voitureDuJoueur);
    }else if (event.key === RETROVISEUR) {
      this.gestionnaireDeVue.changerEtatRetroviseur();
    }
  }

  public toucheRelachee(event): void {
    this.generateurPisteService.deplacementService.toucheRelachee(event);
  }

  public touchePesee(event): void {
    this.generateurPisteService.deplacementService.touchePesee(event);
  }

  private dragPoint(position: any): void {
    this.objetGlisse.position.copy(position);
    const objetGlisseNumber = parseInt(this.objetGlisse.name, 10);
    FacadeLigneService.modifierLignePoints(
      objetGlisseNumber, this.objetGlisse.position, this.renderService.pointsLine, this.renderService.points
    );
    if (objetGlisseNumber === 0 && this.renderService.dessinTermine) {
      this.renderService.points[this.renderService.facadePointService.compteur - 1].position.copy(this.objetGlisse.position);
        FacadeLigneService.modifierLignePoints(
        this.renderService.facadePointService.compteur - 1,
        this.objetGlisse.position,
        this.renderService.pointsLine,
        this.renderService.points
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
