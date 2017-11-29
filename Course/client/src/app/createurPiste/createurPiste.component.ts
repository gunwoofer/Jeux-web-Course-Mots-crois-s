import { EvenementService } from './../gestionnaireEvenement/gestionnaireEvenement.service';
import { MusiqueService } from './../musique/musique.service';
import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { RenderService } from '../renderService/render.service';
import { MessageErreurService } from '../messageErreurs/messageerreur.service';
import { PisteService } from '../piste/piste.service';
import { Piste } from './../piste/piste.model';

@Component({
  moduleId: module.id,
  selector: 'app-createurpiste-component',
  templateUrl: './createurPiste.component.html',
  styleUrls: ['./createurPiste.component.css']
})

export class CreateurPisteComponent implements OnInit {

  constructor(private renderService: RenderService,
    private evenementService: EvenementService,
    private pisteService: PisteService,
    private messageErreurService: MessageErreurService,
    private musiqueService: MusiqueService
  ) {
  }

  private affiche: boolean;
  public pisteAmodifier: Piste;
  public message;

  public get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @ViewChild('container')
  private containerRef: ElementRef;

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.renderService.onResize();
  }

  public ngOnInit(): void {
    this.renderService.initialize(this.container);
    this.pisteService.pisteAEditer.subscribe(
      (piste: Piste) => {
        this.renderService.pisteAmodifie = piste;
      }
    );
    this.musiqueService.musique.arreterMusique();
    this.musiqueService.musique.lancerMusiqueEditeur();
  }

  public oncontextmenu(): boolean {
    this.evenementService.rightClick();
    return false;
  }

  public onMouseMove(event): void {
    this.evenementService.onMouseMove(event);
  }

  public onMouseClick(event): void {
    this.evenementService.onMouseClick(event);
  }

  public onMouseDown(event): void {
    this.evenementService.onMouseDown(event);
  }

  public onMouseUp(event): boolean {
    this.evenementService.onMouseUp(event);
    return false;
  }

  public condition(): boolean {
    this.pisteAmodifier = this.renderService.pisteAmodifie;
    return this.affiche = this.renderService.retourneEtatDessin();
  }

  public erreursCircuit(): boolean {
    if (this.messageErreurService.afficherMessageErreurs(this.renderService.nbAnglesPlusPetit45,
      this.renderService.nbSegmentsTropProche,
      this.renderService.nbSegmentsCroises)) {
      this.message = this.messageErreurService.afficherMessageErreurs(this.renderService.nbAnglesPlusPetit45,
        this.renderService.nbSegmentsTropProche,
        this.renderService.nbSegmentsCroises);
      return true;
    } else {
      return false;
    }
  }
}


