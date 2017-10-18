import { GenerateurPisteService } from './generateurpiste.service';
import { Component, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { PisteService } from '../piste/piste.service';

@Component({
    selector: 'app-generateurpiste-component',
    templateUrl: './generateurpiste.component.html',
    styleUrls: ['./generateurpiste.component.css']
})

export class GenerateurPisteComponent implements AfterViewInit {

    @ViewChild('container')
    private containerRef: ElementRef;

    constructor(private generateurPisteService: GenerateurPisteService, pisteService: PisteService) {

    }

    public ngAfterViewInit() {
        this.generateurPisteService.initialisation(this.container);
    }

    public get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.generateurPisteService.onResize();
    }

    @HostListener('document:keypress', ['$event'])
    public deplacement(event: KeyboardEvent) {
        this.generateurPisteService.deplacementVoiture(event);
    }

    @HostListener('document:keyup', ['$event'])
    public toucheLachee(event: KeyboardEvent) {
        this.generateurPisteService.toucheRelachee(event);
    }

    public cameraZ(event): boolean {
        this.generateurPisteService.cameraAvantArriere(event);
        return false;
    }
}
