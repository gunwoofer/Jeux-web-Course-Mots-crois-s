import { GenerateurPisteService } from './generateurpiste.service';
import { PisteService } from '../piste/piste.service';
import { Piste } from '../piste/piste.model';

import { Component, OnInit, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-generateurpiste-component',
    templateUrl: './generateurpiste.component.html',
    styleUrls: ['./generateurpiste.component.css']
})

export class GenerateurPisteComponent implements AfterViewInit {
    constructor(private generateurPisteService: GenerateurPisteService, private pisteService: PisteService) {
        
    }

    public ngAfterViewInit() {
        this.generateurPisteService.initialisation(this.container);
    }

    public get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @ViewChild('container')
    private containerRef: ElementRef;

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
