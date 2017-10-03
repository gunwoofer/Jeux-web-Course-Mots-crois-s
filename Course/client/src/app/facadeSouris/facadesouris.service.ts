import { Injectable } from '@angular/core';

import * as THREE from 'three';

import { RenderService } from '../renderService/render.service';
import { FacadeCoordonneesService } from '../facadeCoordonnees/facadecoordonnees.service';
import { FacadePointService } from '../facadePoint/facadepoint.service';

@Injectable()
export class FacadeSourisService {
    constructor (private renderService: RenderService) {}

    private tempsMouseDown;
    private tempsMouseUp;
    private dureeClick;
    private modeGlissement;
    private pointHover;
    private objetGlisse;

    private facadeCoordonneesService = new FacadeCoordonneesService();
    private facadePointService = new FacadePointService();

    public onMouseDown(event): void {
        this.tempsMouseDown = new Date().getTime();
        if (this.pointHover) {
          this.modeGlissement = true;
        }
      }

      public onMouseClick(event): void {
        if (!this.modeGlissement || this.dureeClick < 500 && this.objetGlisse && this.objetGlisse.name === '0') {
          this.renderService.dessinerPoint(event);
        }
        this.modeGlissement = false;
      }

      public rightClick(): void {
        this.renderService.supprimerPoint();
        this.modeGlissement = false;
      }

      public onMouseUp(event): void {
        this.tempsMouseUp = new Date().getTime();
        this.dureeClick = this.tempsMouseUp - this.tempsMouseDown;
        if (event.button === 0) {
          if (this.modeGlissement) {
            this.renderService.actualiserDonnees();
          }
        }
      }

      public onMouseMove(event): void {
        const rayCaster = new THREE.Raycaster();
        this.facadeCoordonneesService.miseAJourMouse(event, this.renderService.renderer);
        let intersects;
        this.renderService.scene.updateMatrixWorld(true);
        rayCaster.setFromCamera(this.facadeCoordonneesService.mouse, this.renderService.camera);
        intersects = rayCaster.intersectObjects(this.renderService.scene.children);
        if (this.modeGlissement) {
          this.dragPoint(intersects[0].point);
        } else {
          if (intersects.length > 0) {
            this.facadePointService.actualiserCouleurPoints(this.renderService.points);
            this.pointHover = false;
            for (const objet of intersects) {
              if (objet.object.type === 'Points') {
                this.hoverPoint(objet.object);
              }
            }
          }
        }
      }

      private dragPoint(position): void {
        this.objetGlisse.position.copy(position);
        const objetGlisseNumber = parseInt(this.objetGlisse.name, 10);
        this.renderService.facadeLigne.modifierPointLine(
          objetGlisseNumber, this.objetGlisse.position, this.renderService.pointsLine, this.renderService.points
        );
        if (objetGlisseNumber === 0 && this.renderService.dessinTermine) {
          this.renderService.points[this.renderService.facadePointService.compteur - 1].position.copy(this.objetGlisse.position);
          this.renderService.facadeLigne.modifierPointLine(
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
