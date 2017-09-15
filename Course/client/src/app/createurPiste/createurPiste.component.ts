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

  public onMouseClick(event) {
    this.renderService.dessinerPoint(event);
  }

  public onMouseRightClick(event) {
    return false;
  }

  public onMouseOver(event) {
  }
}
