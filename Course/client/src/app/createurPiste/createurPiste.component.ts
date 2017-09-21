import {PisteValidationComponent} from './../piste/pisteValidation.component';
import {AfterViewInit, Component, ElementRef, ViewChild, HostListener} from '@angular/core';
import {RenderService} from './render.service';


@Component({
  moduleId: module.id,
  selector: 'app-createurpiste-component',
  templateUrl: './createurPiste.component.html',
  styleUrls: ['./createurPiste.component.css']
})

export class CreateurPisteComponent implements AfterViewInit {

  constructor(private renderService: RenderService) {
  }

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
    this.renderService.rightClick();
    return false;
  }

  public onMouseMove(event): void {
    this.renderService.onMouseMove(event);
  }

  public onMouseClick(event): void {
     this.renderService.onMouseClick(event);
  }

  public onMouseDown(event): void {
    this.renderService.onMouseDown(event);
  }

  public onMouseUp(event): boolean {
    this.renderService.onMouseUp(event);
    return false;
  }

  private listePoints(): THREE.Points[] {
    return this.points = this.renderService.points;
  }

  private condition(): boolean {
    return this.affiche = this.renderService.retourneetatDessin();
  }

  private erreursCircuit(): boolean {
    if (this.renderService.afficherMessageErreurs()) {
      this.message = this.renderService.afficherMessageErreurs();
      return true;
    }else {
      return false;
    }
  }
}
