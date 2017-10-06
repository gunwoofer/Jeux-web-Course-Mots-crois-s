import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from '@angular/core';

import { FacadeSourisService } from '../facadeSouris/facadesouris.service';
import { RenderService } from '../renderService/render.service';
import { MessageErreurService } from '../messageErreurs/messageerreur.service';


@Component({
  moduleId: module.id,
  selector: 'app-createurpiste-component',
  templateUrl: './createurPiste.component.html',
  styleUrls: ['./createurPiste.component.css']
})

export class CreateurPisteComponent implements AfterViewInit {

  constructor(private renderService: RenderService, private facadeSourisService: FacadeSourisService) {
  }

  private messageErreurService = new MessageErreurService();
  private points: THREE.Points[];
  private affiche: boolean;
  private message;

  public get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @ViewChild('container')
  private containerRef: ElementRef;

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.renderService.onResize();
  }

  public ngAfterViewInit(): void {
    this.renderService.initialize(this.container);
  }

  private oncontextmenu(): boolean {
    this.facadeSourisService.rightClick();
    return false;
  }

  public onMouseMove(event): void {
    this.facadeSourisService.onMouseMove(event);
  }

  public onMouseClick(event): void {
    this.facadeSourisService.onMouseClick(event);
  }

  public onMouseDown(event): void {
    this.facadeSourisService.onMouseDown(event);
  }

  public onMouseUp(event): boolean {
    this.facadeSourisService.onMouseUp(event);
    return false;
  }

  private listePoints(): THREE.Points[] {
    return this.points = this.renderService.points;
  }

  private condition(): boolean {
    return this.affiche = this.renderService.retourneEtatDessin();
  }

  private erreursCircuit(): boolean {
    if (this.messageErreurService.afficherMessageErreurs(this.renderService.nbAnglesPlusPetit45, this.renderService.nbSegmentsTropProche, this.renderService.nbSegmentsCroises)) {
      this.message = this.messageErreurService.afficherMessageErreurs(this.renderService.nbAnglesPlusPetit45, this.renderService.nbSegmentsTropProche, this.renderService.nbSegmentsCroises);
      return true;
    } else {
      return false;
    }
  }

  private reinitialiser() {
    this.renderService.reinitialiserScene();
  }

  private importerPiste() {
    this.renderService.chargerPiste(); // Sans paramètre, utilise l'attribut piste de renderService pour charger une piste.
  }
}
