import { MusiqueService } from './../musique/musique.service';
import { GenerateurPisteService } from './generateurpiste.service';
import { Component, ViewChild, HostListener, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { PisteService } from '../piste/piste.service';

@Component({
    selector: 'app-generateurpiste-component',
    templateUrl: './generateurpiste.component.html',
    styleUrls: ['./generateurpiste.component.css']
})

export class GenerateurPisteComponent implements AfterViewInit, OnInit {

    @ViewChild('container')
    private containerRef: ElementRef;

    constructor(private generateurPisteService: GenerateurPisteService,
        pisteService: PisteService,
        private musiqueService: MusiqueService
    ) {}

    public ngOnInit() {
        this.musiqueService.musique.arreterMusique();
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
    public touchePressee(event: KeyboardEvent) {
        this.generateurPisteService.zoom(event);
        this.generateurPisteService.deplacementVoiture(event);
        this.generateurPisteService.gestionEvenement(event);
    }

    @HostListener('document:keyup', ['$event'])
    public toucheLachee(event: KeyboardEvent) {
        this.generateurPisteService.toucheRelachee(event);
    }
}
