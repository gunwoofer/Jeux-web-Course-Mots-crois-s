import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import {IaRenderService} from './iaRender.service';

@Component({
  selector: 'app-ia-component',
  templateUrl: './ia.component.html',
  styleUrls: ['./ia.component.css']
})

export class IaComponent implements AfterViewInit {

  constructor(private renderService: IaRenderService) {
  }

  private get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @ViewChild('container')
  private containerRef: ElementRef;

  @Input()
  public rotationSpeedX = 0.005;

  @Input()
  public rotationSpeedY = 0.01;

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.renderService.onResize();
  }

  public ngAfterViewInit() {
    this.renderService.initialize(this.container, this.rotationSpeedX, this.rotationSpeedY);
  }
}
