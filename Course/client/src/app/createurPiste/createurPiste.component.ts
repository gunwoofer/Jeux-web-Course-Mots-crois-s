import { PisteValidationComponent } from './../piste/pisteValidation.component';
import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from '@angular/core';
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

  public cliqueGauche(event) {
    this.renderService.dessinerPoint(event);
  }

  public cliqueDroit(event) {
    this.renderService.supprimerPoint();
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
}
