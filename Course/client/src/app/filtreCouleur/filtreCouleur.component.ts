import { NgForm } from '@angular/forms';
import { FiltreCouleurService } from './filtreCouleur.service';
import { Component, ViewChild, HostListener, ElementRef, AfterViewInit, OnInit } from '@angular/core';

@Component({
    selector: 'app-filtrecouleur',
    templateUrl: './filtrecouleur.component.html',
    styleUrls: ['./filtrecouleur.component.css']
})
export class FiltreCouleurComponent implements AfterViewInit {

    @ViewChild('container') private containerRef: ElementRef;
    private disableFiltrage = false;

    constructor(private filtreCouleurService: FiltreCouleurService) { }

    public ngAfterViewInit() {
        this.filtreCouleurService.initialisation(this.container);
    }

    public get container(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @HostListener('window:resize', ['$event'])
    public onResize() {
        this.filtreCouleurService.onResize();
    }

    public onSubmit(f: NgForm): void {
        this.filtreCouleurService.appliquerFiltreScene(f.value.probleme);
        this.disableFiltrage = true;
    }

    public enleverFiltre(): void {
        this.filtreCouleurService.enleverFiltre();
        this.disableFiltrage = false;
    }
}
