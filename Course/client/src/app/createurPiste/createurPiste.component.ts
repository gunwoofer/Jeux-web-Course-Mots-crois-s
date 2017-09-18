import {PisteValidationComponent} from './../piste/pisteValidation.component';
import {AfterViewInit, Component, ElementRef, ViewChild, HostListener} from '@angular/core';
import {RenderService} from './render.service';


@Component({
  moduleId: module.id,
  selector: 'app-createurPiste-component',
  templateUrl: './createurPiste.component.html',
  styleUrls: ['./createurPiste.component.css']
})

export class CreateurPiste implements AfterViewInit {

  constructor(private renderService: RenderService) {
  }

  private points: THREE.Points[];
  private lignes: THREE.Line[];
  private affiche: boolean;

  private nbSegmentsCroises = 0;
  private nbAnglesPlusPetit45 = 0;
  private nbSegmentsTropProche = 0;
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

  public ngAfterViewInit() {
    this.renderService.initialize(this.container);
  }

  private oncontextmenu() {
    return false;
  }

  public onMouseMove(event) {
    this.renderService.onMouseMove(event);
  }

  public onMouseDown(event) {
    this.renderService.onMouseDown(event);
  }

  public onMouseUp(event) {
    this.renderService.onMouseUp(event);
    return false;
  }

  private listePoints() {
    return this.points = this.renderService.retournerListeLines();
  }

  private listeLignes() {
    return this.lignes = this.renderService.retournerListePoints();
  }

  private condition() {
    return this.affiche = this.renderService.retourneetatDessin();
  }

  private erreursCircuit() {
    this.nbSegmentsTropProche = this.renderService.nbSegmentsTropProche;
    this.nbSegmentsCroises = this.renderService.nbSegmentsCroises;
    this.nbAnglesPlusPetit45 = this.renderService.nbAnglesPlusPetit45;
    if (this.nbAnglesPlusPetit45 + this.nbSegmentsCroises + this.nbSegmentsTropProche !== 0){
      this.message = 'Il y a : \n ' + this.nbAnglesPlusPetit45 + ' angle(s) plus petit(s) que 45 degrés (en rouge) \n '
        + this.nbSegmentsTropProche + ' segment(s) trop proche(s) (en orange) \n '
        + this.nbSegmentsCroises + ' segment(s) croisé(s) \n '
        + 'Veuillez corriger les erreursCircuit pour valider la piste ';
      return true;
    }else {
      return false;
    }
  }
}
