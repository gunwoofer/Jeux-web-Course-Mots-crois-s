import { GenerateurPisteService } from './generateurpiste.service';


import { Component, OnInit, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'app-generateurpiste-component',
    templateUrl: './generateurpiste.component.html',
    styleUrls: ['./generateurpiste.component.css']
})

export class GenerateurPisteComponent implements AfterViewInit {
    constructor(private generateurPisteService: GenerateurPisteService) {}

    public get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @ViewChild('container')
    private containerRef: ElementRef;

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.generateurPisteService.onResize();
    }

    public ngAfterViewInit(): void {
    this.generateurPisteService.initialisation(this.container);
    }

}
