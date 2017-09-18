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

  points : THREE.Points[];
  lignes : THREE.Line[];
  affiche : boolean;

  private get container(): HTMLDivElement {
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
    this.renderService.supprimerPoint(event);
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
}
